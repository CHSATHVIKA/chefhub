package com.chefhub.dto;

import com.chefhub.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull BookingStatus status) {
}
