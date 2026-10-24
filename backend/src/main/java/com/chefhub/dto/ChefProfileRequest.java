package com.chefhub.dto;

import com.chefhub.entity.Tier;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ChefProfileRequest(
        @NotBlank @Size(max = 1000) String bio,
        @NotBlank @Size(max = 255) String cuisines,
        @NotNull @DecimalMin("0.0") BigDecimal pricePerVisit,
        @NotBlank @Size(max = 80) String city,
        @Size(max = 500) String photoUrl,
        @NotNull Tier tier
) {
}
