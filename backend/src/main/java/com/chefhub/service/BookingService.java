package com.chefhub.service;

import com.chefhub.dto.BookingRequest;
import com.chefhub.dto.BookingResponse;
import com.chefhub.entity.*;
import com.chefhub.exception.BadRequestException;
import com.chefhub.exception.ResourceNotFoundException;
import com.chefhub.repository.AvailabilitySlotRepository;
import com.chefhub.repository.BookingRepository;
import com.chefhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Set<BookingStatus> ACTIVE = Set.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);

    // which statuses a chef can move a booking to, from its current status
    private static final Map<BookingStatus, Set<BookingStatus>> CHEF_TRANSITIONS = Map.of(
            BookingStatus.PENDING, Set.of(BookingStatus.CONFIRMED, BookingStatus.REJECTED),
            BookingStatus.CONFIRMED, Set.of(BookingStatus.COMPLETED)
    );

    private final BookingRepository bookingRepository;
    private final AvailabilitySlotRepository slotRepository;
    private final UserRepository userRepository;
    private final ChefService chefService;

    @Transactional
    public BookingResponse createBooking(String customerEmail, BookingRequest request) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // row lock so two customers cannot grab the same slot at the same time
        AvailabilitySlot slot = slotRepository.findByIdForUpdate(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        ChefProfile chef = slot.getChef();
        if (!chef.isApproved()) {
            throw new BadRequestException("This chef is not taking bookings right now");
        }
        if (slot.getDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("This slot is in the past");
        }
        if (slot.isBooked() || bookingRepository.existsBySlotIdAndStatusIn(slot.getId(), ACTIVE)) {
            throw new BadRequestException("Sorry, this slot was just booked by someone else");
        }

        slot.setBooked(true);
        Booking booking = Booking.builder()
                .customer(customer)
                .chef(chef)
                .slot(slot)
                .address(request.address().trim())
                .guestCount(request.guestCount())
                .notes(request.notes())
                .totalPrice(chef.getPricePerVisit())
                .status(BookingStatus.PENDING)
                .build();

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCustomerBookings(String customerEmail) {
        return bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse cancelBooking(String customerEmail, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .filter(b -> b.getCustomer().getEmail().equals(customerEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!ACTIVE.contains(booking.getStatus())) {
            throw new BadRequestException("Only pending or confirmed bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getSlot().setBooked(false);
        return BookingResponse.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getChefBookings(String chefEmail) {
        ChefProfile chef = chefService.getChefByEmail(chefEmail);
        return bookingRepository.findByChefIdOrderByCreatedAtDesc(chef.getId()).stream()
                .map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse updateStatusByChef(String chefEmail, Long bookingId, BookingStatus newStatus) {
        ChefProfile chef = chefService.getChefByEmail(chefEmail);
        Booking booking = bookingRepository.findById(bookingId)
                .filter(b -> b.getChef().getId().equals(chef.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Set<BookingStatus> allowed = CHEF_TRANSITIONS.getOrDefault(booking.getStatus(), Set.of());
        if (!allowed.contains(newStatus)) {
            throw new BadRequestException("Cannot change a " + booking.getStatus() + " booking to " + newStatus);
        }

        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.REJECTED) {
            booking.getSlot().setBooked(false);
        }
        return BookingResponse.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingResponse::from).toList();
    }
}
