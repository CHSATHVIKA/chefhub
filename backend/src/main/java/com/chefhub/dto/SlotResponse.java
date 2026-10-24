package com.chefhub.dto;

import com.chefhub.entity.AvailabilitySlot;

import java.time.LocalDate;
import java.time.LocalTime;

public record SlotResponse(Long id, LocalDate date, LocalTime startTime, LocalTime endTime, boolean booked) {

    public static SlotResponse from(AvailabilitySlot slot) {
        return new SlotResponse(slot.getId(), slot.getDate(), slot.getStartTime(), slot.getEndTime(), slot.isBooked());
    }
}
