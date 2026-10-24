package com.chefhub.service;

import com.chefhub.dto.MenuItemRequest;
import com.chefhub.dto.MenuItemResponse;
import com.chefhub.entity.ChefProfile;
import com.chefhub.entity.MenuItem;
import com.chefhub.exception.ResourceNotFoundException;
import com.chefhub.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final ChefService chefService;

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getMyMenu(String email) {
        ChefProfile chef = chefService.getChefByEmail(email);
        return menuItemRepository.findByChefIdOrderByIdAsc(chef.getId()).stream()
                .map(MenuItemResponse::from).toList();
    }

    @Transactional
    public MenuItemResponse addItem(String email, MenuItemRequest request) {
        ChefProfile chef = chefService.getChefByEmail(email);
        MenuItem item = MenuItem.builder().chef(chef).build();
        copy(request, item);
        return MenuItemResponse.from(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemResponse updateItem(String email, Long itemId, MenuItemRequest request) {
        MenuItem item = findOwnItem(email, itemId);
        copy(request, item);
        return MenuItemResponse.from(item);
    }

    @Transactional
    public void deleteItem(String email, Long itemId) {
        menuItemRepository.delete(findOwnItem(email, itemId));
    }

    private MenuItem findOwnItem(String email, Long itemId) {
        ChefProfile chef = chefService.getChefByEmail(email);
        return menuItemRepository.findById(itemId)
                .filter(item -> item.getChef().getId().equals(chef.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
    }

    private void copy(MenuItemRequest request, MenuItem item) {
        item.setName(request.name().trim());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setVeg(request.veg());
    }
}
