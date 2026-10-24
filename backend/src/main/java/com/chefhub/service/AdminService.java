package com.chefhub.service;

import com.chefhub.dto.ChefResponse;
import com.chefhub.entity.ChefProfile;
import com.chefhub.exception.ResourceNotFoundException;
import com.chefhub.repository.ChefProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ChefProfileRepository chefProfileRepository;

    @Transactional(readOnly = true)
    public List<ChefResponse> getAllChefs() {
        return chefProfileRepository.findAllByOrderByIdDesc().stream().map(ChefResponse::from).toList();
    }

    @Transactional
    public ChefResponse setApproved(Long chefId, boolean approved) {
        ChefProfile chef = chefProfileRepository.findById(chefId)
                .orElseThrow(() -> new ResourceNotFoundException("Chef not found"));
        chef.setApproved(approved);
        return ChefResponse.from(chef);
    }
}
