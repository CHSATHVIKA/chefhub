package com.chefhub.service;

import com.chefhub.dto.SlotRequest;
import com.chefhub.dto.SlotResponse;
import com.chefhub.entity.AvailabilitySlot;
import com.chefhub.entity.ChefProfile;
import com.chefhub.exception.BadRequestException;
import com.chefhub.exception.ResourceNotFoundException;
import com.chefhub.repository.AvailabilitySlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final AvailabilitySlotRepository slotRepository;
    private final ChefService chefService;

    @Transactional(readOnly = true)
    public List<SlotResponse> getMySlots(String email) {
        ChefProfile chef = chefService.getChefByEmail(email);
        return slotRepository.findByChefIdOrderByDateAscStartTimeAsc(chef.getId()).stream()
                .map(SlotResponse::from).toList();
    }

    @Transactional
    public SlotResponse addSlot(String email, SlotRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BadRequestException("End time must be after start time");
        }
        ChefProfile chef = chefService.getChefByEmail(email);
        boolean overlaps = slotRepository.existsByChefIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                chef.getId(), request.date(), request.endTime(), request.startTime());
        if (overlaps) {
            throw new BadRequestException("This slot overlaps with one you already added");
        }

        AvailabilitySlot slot = AvailabilitySlot.builder()
                .chef(chef)
                .date(request.date())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .build();
        return SlotResponse.from(slotRepository.save(slot));
    }

    @Transactional
    public void deleteSlot(String email, Long slotId) {
        ChefProfile chef = chefService.getChefByEmail(email);
        AvailabilitySlot slot = slotRepository.findById(slotId)
                .filter(s -> s.getChef().getId().equals(chef.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
        if (slot.isBooked()) {
            throw new BadRequestException("This slot already has a booking and cannot be removed");
        }
        slotRepository.delete(slot);
    }
}
