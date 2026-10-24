package com.chefhub.service;

import com.chefhub.dto.*;
import com.chefhub.entity.ChefProfile;
import com.chefhub.entity.Tier;
import com.chefhub.exception.ResourceNotFoundException;
import com.chefhub.repository.AvailabilitySlotRepository;
import com.chefhub.repository.ChefProfileRepository;
import com.chefhub.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ChefService {

    private final ChefProfileRepository chefProfileRepository;
    private final MenuItemRepository menuItemRepository;
    private final AvailabilitySlotRepository slotRepository;

    @Transactional(readOnly = true)
    public PageResponse<ChefResponse> search(String city, String cuisine, Tier tier, int page, int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("id"));
        var result = chefProfileRepository.search(blankToNull(city), blankToNull(cuisine), tier, pageable)
                .map(ChefResponse::from);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public ChefDetailResponse getChefDetails(Long chefId) {
        ChefProfile chef = chefProfileRepository.findById(chefId)
                .filter(ChefProfile::isApproved)
                .orElseThrow(() -> new ResourceNotFoundException("Chef not found"));

        var menu = menuItemRepository.findByChefIdOrderByIdAsc(chefId).stream()
                .map(MenuItemResponse::from).toList();
        var slots = slotRepository
                .findByChefIdAndBookedFalseAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(chefId, LocalDate.now())
                .stream().map(SlotResponse::from).toList();

        return new ChefDetailResponse(ChefResponse.from(chef), menu, slots);
    }

    @Transactional(readOnly = true)
    public ChefResponse getMyProfile(String email) {
        return ChefResponse.from(getChefByEmail(email));
    }

    @Transactional
    public ChefResponse updateMyProfile(String email, ChefProfileRequest request) {
        ChefProfile chef = getChefByEmail(email);
        chef.setBio(request.bio().trim());
        chef.setCuisines(request.cuisines().trim());
        chef.setPricePerVisit(request.pricePerVisit());
        chef.setCity(request.city().trim());
        chef.setPhotoUrl(request.photoUrl());
        chef.setTier(request.tier());
        return ChefResponse.from(chef);
    }

    public ChefProfile getChefByEmail(String email) {
        return chefProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Chef profile not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
