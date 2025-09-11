package com.example.techmart.shared.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a product available for sale in the TechMart store.
 *
 * This record serves as the core domain model for a product, containing all
 * essential information like name, price, category, and stock quantity.
 * It is used across all features of the e-commerce platform.
 *
 * @param id            The unique identifier for the product.
 * @param name          The display name of the product.
 * @param description   A brief description.
 * @param price         The price of the product.
 * @param category      The product's category.
 * @param tags          A list of search tags.
 * @param stockQuantity The number of units available in inventory.
 * @param active        Whether the product is currently available for sale.
 * @param createdAt     The timestamp when the product was created.
 */
public record Product(
        Long id,
        String name,
        String description,
        BigDecimal price,
        ProductCategory category,
        List<String> tags,
        int stockQuantity,
        boolean active,
        LocalDateTime createdAt
) {
    public boolean isInStock() {
        return stockQuantity > 0;
    }
}