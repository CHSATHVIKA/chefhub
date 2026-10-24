package com.chefhub.service;

import com.chefhub.dto.BookingRequest;
import com.chefhub.dto.BookingResponse;
import com.chefhub.entity.*;
import com.chefhub.exception.BadRequestException;
import com.chefhub.repository.AvailabilitySlotRepository;
import com.chefhub.repository.BookingRepository;
import com.chefhub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private AvailabilitySlotRepository slotRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ChefService chefService;

    @InjectMocks
    private BookingService bookingService;

    private User customer;
    private ChefProfile chef;
    private AvailabilitySlot slot;

    @BeforeEach
    void setUp() {
        customer = User.builder().id(1L).name("Priya").email("priya@example.com").role(Role.CUSTOMER).build();
        User chefUser = User.builder().id(2L).name("Arjun").email("arjun@chefhub.in").role(Role.CHEF).build();
        chef = ChefProfile.builder().id(10L).user(chefUser).city("Mumbai")
                .pricePerVisit(BigDecimal.valueOf(3000)).approved(true).build();
        slot = AvailabilitySlot.builder().id(100L).chef(chef).date(LocalDate.now().plusDays(3))
                .startTime(LocalTime.of(19, 0)).endTime(LocalTime.of(22, 0)).build();
    }

    @Test
    void createBooking_marksSlotBookedAndStartsAsPending() {
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(slotRepository.findByIdForUpdate(100L)).thenReturn(Optional.of(slot));
        when(bookingRepository.existsBySlotIdAndStatusIn(anyLong(), anyCollection())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponse response = bookingService.createBooking(customer.getEmail(),
                new BookingRequest(100L, "12 Hill Road, Bandra", 4, null));

        assertThat(response.status()).isEqualTo(BookingStatus.PENDING);
        assertThat(response.totalPrice()).isEqualByComparingTo("3000");
        assertThat(slot.isBooked()).isTrue();
    }

    @Test
    void createBooking_rejectsAlreadyBookedSlot() {
        slot.setBooked(true);
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(slotRepository.findByIdForUpdate(100L)).thenReturn(Optional.of(slot));

        assertThatThrownBy(() -> bookingService.createBooking(customer.getEmail(),
                new BookingRequest(100L, "12 Hill Road", 2, null)))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("just booked");

        verify(bookingRepository, never()).save(any());
    }

    @Test
    void createBooking_rejectsSlotWithActiveBooking() {
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(slotRepository.findByIdForUpdate(100L)).thenReturn(Optional.of(slot));
        when(bookingRepository.existsBySlotIdAndStatusIn(anyLong(), anyCollection())).thenReturn(true);

        assertThatThrownBy(() -> bookingService.createBooking(customer.getEmail(),
                new BookingRequest(100L, "12 Hill Road", 2, null)))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void cancelBooking_setsCancelledAndFreesSlot() {
        Booking booking = booking(BookingStatus.CONFIRMED);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        BookingResponse response = bookingService.cancelBooking(customer.getEmail(), 1L);

        assertThat(response.status()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(slot.isBooked()).isFalse();
    }

    @Test
    void cancelBooking_notAllowedOnceCompleted() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking(BookingStatus.COMPLETED)));

        assertThatThrownBy(() -> bookingService.cancelBooking(customer.getEmail(), 1L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void chefCanConfirmThenComplete() {
        Booking booking = booking(BookingStatus.PENDING);
        when(chefService.getChefByEmail("arjun@chefhub.in")).thenReturn(chef);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        bookingService.updateStatusByChef("arjun@chefhub.in", 1L, BookingStatus.CONFIRMED);
        BookingResponse response = bookingService.updateStatusByChef("arjun@chefhub.in", 1L, BookingStatus.COMPLETED);

        assertThat(response.status()).isEqualTo(BookingStatus.COMPLETED);
    }

    @Test
    void chefRejectFreesSlot() {
        Booking booking = booking(BookingStatus.PENDING);
        when(chefService.getChefByEmail("arjun@chefhub.in")).thenReturn(chef);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        bookingService.updateStatusByChef("arjun@chefhub.in", 1L, BookingStatus.REJECTED);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.REJECTED);
        assertThat(slot.isBooked()).isFalse();
    }

    @Test
    void chefCannotCompletePendingBooking() {
        when(chefService.getChefByEmail("arjun@chefhub.in")).thenReturn(chef);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking(BookingStatus.PENDING)));

        assertThatThrownBy(() -> bookingService.updateStatusByChef("arjun@chefhub.in", 1L, BookingStatus.COMPLETED))
                .isInstanceOf(BadRequestException.class);
    }

    private Booking booking(BookingStatus status) {
        slot.setBooked(true);
        return Booking.builder().id(1L).customer(customer).chef(chef).slot(slot)
                .address("12 Hill Road").guestCount(4).totalPrice(BigDecimal.valueOf(3000)).status(status).build();
    }
}
