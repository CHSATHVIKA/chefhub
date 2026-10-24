package com.chefhub.controller;

import com.chefhub.dto.ChefDetailResponse;
import com.chefhub.dto.ChefResponse;
import com.chefhub.dto.PageResponse;
import com.chefhub.entity.Tier;
import com.chefhub.service.ChefService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chefs")
@RequiredArgsConstructor
public class ChefController {

    private final ChefService chefService;

    @GetMapping
    public PageResponse<ChefResponse> search(@RequestParam(required = false) String city,
                                             @RequestParam(required = false) String cuisine,
                                             @RequestParam(required = false) Tier tier,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "9") int size) {
        return chefService.search(city, cuisine, tier, page, size);
    }

    @GetMapping("/{id}")
    public ChefDetailResponse getChef(@PathVariable Long id) {
        return chefService.getChefDetails(id);
    }
}
