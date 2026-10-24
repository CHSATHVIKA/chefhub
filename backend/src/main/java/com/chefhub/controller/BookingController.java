package com.chefhub.controller;

import com.chefhub.dto.BookingRequest;
import com.chefhub.dto.BookingResponse;
import com.chefhub.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(Principal principal, @Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<BookingResponse> myBookings(Principal principal) {
        return bookingService.getCustomerBookings(principal.getName());
    }

    @PatchMapping("/{id}/cancel")
    public BookingResponse cancel(Principal principal, @PathVariable Long id) {
        return bookingService.cancelBooking(principal.getName(), id);
    }
}
