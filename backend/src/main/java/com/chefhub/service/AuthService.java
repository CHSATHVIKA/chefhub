package com.chefhub.service;

import com.chefhub.dto.AuthResponse;
import com.chefhub.dto.LoginRequest;
import com.chefhub.dto.RegisterRequest;
import com.chefhub.entity.ChefProfile;
import com.chefhub.entity.Role;
import com.chefhub.entity.User;
import com.chefhub.exception.BadRequestException;
import com.chefhub.repository.ChefProfileRepository;
import com.chefhub.repository.UserRepository;
import com.chefhub.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ChefProfileRepository chefProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new BadRequestException("You can only sign up as a customer or a chef");
        }
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = userRepository.save(User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .role(request.role())
                .build());

        // new chefs start with an empty profile that needs admin approval
        if (user.getRole() == Role.CHEF) {
            chefProfileRepository.save(ChefProfile.builder()
                    .user(user)
                    .bio("")
                    .cuisines("")
                    .city("")
                    .pricePerVisit(BigDecimal.ZERO)
                    .approved(false)
                    .build());
        }

        return toResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        User user = userRepository.findByEmail(email).orElseThrow();
        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
