package com.chefhub.dto;

import com.chefhub.entity.MenuItem;

import java.math.BigDecimal;

public record MenuItemResponse(Long id, String name, String description, BigDecimal price, boolean veg) {

    public static MenuItemResponse from(MenuItem item) {
        return new MenuItemResponse(item.getId(), item.getName(), item.getDescription(), item.getPrice(), item.isVeg());
    }
}
