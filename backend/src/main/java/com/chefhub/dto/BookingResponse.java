package com.chefhub.dto;

import com.chefhub.entity.Booking;
import com.chefhub.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record BookingResponse(
        Long id,
        Long chefId,
        String chefName,
        String chefPhotoUrl,
        String city,
        String customerName,
        String customerEmail,
        String customerPhone,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        String address,
        int guestCount,
        String notes,
        BigDecimal totalPrice,
        BookingStatus status,
        LocalDateTime createdAt
) {
    public static BookingResponse from(Booking b) {
        return new BookingResponse(b.getId(), b.getChef().getId(), b.getChef().getUser().getName(),
                b.getChef().getPhotoUrl(), b.getChef().getCity(), b.getCustomer().getName(),
                b.getCustomer().getEmail(), b.getCustomer().getPhone(), b.getSlot().getDate(),
                b.getSlot().getStartTime(), b.getSlot().getEndTime(), b.getAddress(), b.getGuestCount(),
                b.getNotes(), b.getTotalPrice(), b.getStatus(), b.getCreatedAt());
    }
}
