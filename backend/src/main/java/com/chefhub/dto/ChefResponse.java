package com.chefhub.dto;

import com.chefhub.entity.ChefProfile;
import com.chefhub.entity.Tier;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public record ChefResponse(
        Long id,
        String name,
        String email,
        String bio,
        List<String> cuisines,
        BigDecimal pricePerVisit,
        String city,
        String photoUrl,
        Tier tier,
        boolean approved
) {
    public static ChefResponse from(ChefProfile chef) {
        List<String> cuisines = chef.getCuisines() == null || chef.getCuisines().isBlank()
                ? List.of()
                : Arrays.stream(chef.getCuisines().split(",")).map(String::trim).toList();
        return new ChefResponse(chef.getId(), chef.getUser().getName(), chef.getUser().getEmail(), chef.getBio(),
                cuisines, chef.getPricePerVisit(), chef.getCity(), chef.getPhotoUrl(), chef.getTier(),
                chef.isApproved());
    }
}
