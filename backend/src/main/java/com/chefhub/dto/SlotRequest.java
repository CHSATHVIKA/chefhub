package com.chefhub.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record SlotRequest(
        @NotNull @FutureOrPresent LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime
) {
}
