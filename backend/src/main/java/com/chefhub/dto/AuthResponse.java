package com.chefhub.dto;

import com.chefhub.entity.Role;

public record AuthResponse(String token, Long id, String name, String email, Role role) {
}
