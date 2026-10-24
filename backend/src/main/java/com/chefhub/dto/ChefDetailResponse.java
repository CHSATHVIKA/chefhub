package com.chefhub.dto;

import java.util.List;

public record ChefDetailResponse(ChefResponse chef, List<MenuItemResponse> menu, List<SlotResponse> slots) {
}
