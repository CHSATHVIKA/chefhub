package com.chefhub.dto;

import jakarta.validation.constraints.*;

public record BookingRequest(
        @NotNull Long slotId,
        @NotBlank @Size(max = 500) String address,
        @Min(1) @Max(50) int guestCount,
        @Size(max = 500) String notes
) {
}
