package com.chefhub.controller;

import com.chefhub.dto.BookingResponse;
import com.chefhub.dto.ChefResponse;
import com.chefhub.service.AdminService;
import com.chefhub.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;

    @GetMapping("/chefs")
    public List<ChefResponse> getChefs() {
        return adminService.getAllChefs();
    }

    @PatchMapping("/chefs/{id}/approve")
    public ChefResponse approve(@PathVariable Long id) {
        return adminService.setApproved(id, true);
    }

    @PatchMapping("/chefs/{id}/block")
    public ChefResponse block(@PathVariable Long id) {
        return adminService.setApproved(id, false);
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getBookings() {
        return bookingService.getAllBookings();
    }
}
