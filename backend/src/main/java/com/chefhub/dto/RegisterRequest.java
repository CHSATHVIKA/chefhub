package com.chefhub.dto;

import com.chefhub.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 60) String password,
        @Size(max = 15) String phone,
        @NotNull Role role
) {
}
