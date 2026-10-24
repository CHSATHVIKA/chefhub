package com.chefhub.controller;

import com.chefhub.dto.*;
import com.chefhub.service.BookingService;
import com.chefhub.service.ChefService;
import com.chefhub.service.MenuService;
import com.chefhub.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chef")
@RequiredArgsConstructor
public class ChefDashboardController {

    private final ChefService chefService;
    private final MenuService menuService;
    private final SlotService slotService;
    private final BookingService bookingService;

    @GetMapping("/profile")
    public ChefResponse getProfile(Principal principal) {
        return chefService.getMyProfile(principal.getName());
    }

    @PutMapping("/profile")
    public ChefResponse updateProfile(Principal principal, @Valid @RequestBody ChefProfileRequest request) {
        return chefService.updateMyProfile(principal.getName(), request);
    }

    @GetMapping("/menu")
    public List<MenuItemResponse> getMenu(Principal principal) {
        return menuService.getMyMenu(principal.getName());
    }

    @PostMapping("/menu")
    @ResponseStatus(HttpStatus.CREATED)
    public MenuItemResponse addMenuItem(Principal principal, @Valid @RequestBody MenuItemRequest request) {
        return menuService.addItem(principal.getName(), request);
    }

    @PutMapping("/menu/{id}")
    public MenuItemResponse updateMenuItem(Principal principal, @PathVariable Long id,
                                           @Valid @RequestBody MenuItemRequest request) {
        return menuService.updateItem(principal.getName(), id, request);
    }

    @DeleteMapping("/menu/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMenuItem(Principal principal, @PathVariable Long id) {
        menuService.deleteItem(principal.getName(), id);
    }

    @GetMapping("/slots")
    public List<SlotResponse> getSlots(Principal principal) {
        return slotService.getMySlots(principal.getName());
    }

    @PostMapping("/slots")
    @ResponseStatus(HttpStatus.CREATED)
    public SlotResponse addSlot(Principal principal, @Valid @RequestBody SlotRequest request) {
        return slotService.addSlot(principal.getName(), request);
    }

    @DeleteMapping("/slots/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSlot(Principal principal, @PathVariable Long id) {
        slotService.deleteSlot(principal.getName(), id);
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getBookings(Principal principal) {
        return bookingService.getChefBookings(principal.getName());
    }

    @PatchMapping("/bookings/{id}/status")
    public BookingResponse updateBookingStatus(Principal principal, @PathVariable Long id,
                                               @Valid @RequestBody StatusUpdateRequest request) {
        return bookingService.updateStatusByChef(principal.getName(), id, request.status());
    }
}
