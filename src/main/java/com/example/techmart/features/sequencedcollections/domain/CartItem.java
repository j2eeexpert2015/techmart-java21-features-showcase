package com.example.techmart.features.sequencedcollections.domain;

import com.example.techmart.shared.domain.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a single item within a shopping cart.
 *
 * This record links a {@link Product} with a specific quantity, the unit price at the
 * time of addition, and a timestamp. It acts as a value object within the shopping cart's
 * sequenced collection.
 *
 * @param id        A unique identifier for this specific cart item instance.
 * @param product   The product being added to the cart.
 * @param quantity  The number of units of the product.
 * @param unitPrice The price of a single unit at the time it was added.
 * @param addedAt   The timestamp of when the item was added to the cart.
 */
public record CartItem(
        Long id,
        Product product,
        int quantity,
        BigDecimal unitPrice,
        LocalDateTime addedAt
) {
    public BigDecimal getTotalPrice() {
        return unitPrice.multiply(new BigDecimal(quantity));
    }
}