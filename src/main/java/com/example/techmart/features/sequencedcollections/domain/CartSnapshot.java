package com.example.techmart.features.sequencedcollections.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Immutable snapshot of cart state for history tracking.
 * Used with SequencedDeque to maintain chronological cart changes.
 */
public record CartSnapshot(
        UUID snapshotId,
        List<Long> cartItemIds,
        LocalDateTime timestamp,
        String action
) {

    /**
     * Compact constructor with validation.
     */
    public CartSnapshot {
        if (snapshotId == null) {
            snapshotId = UUID.randomUUID();
        }
        if (cartItemIds == null) {
            cartItemIds = List.of();
        } else {
            cartItemIds = List.copyOf(cartItemIds); // Ensure immutability
        }
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (action == null || action.isBlank()) {
            action = "UNKNOWN";
        }
    }

    /**
     * Get number of items in this cart snapshot.
     */
    public int getItemCount() {
        return cartItemIds.size();
    }

    /**
     * Check if cart was empty in this snapshot.
     */
    public boolean isEmpty() {
        return cartItemIds.isEmpty();
    }

    /**
     * Create snapshot for adding item.
     */
    public static CartSnapshot forAddItem(List<Long> cartItemIds, Long newItemId) {
        List<Long> updatedItems = new java.util.ArrayList<>(cartItemIds);
        updatedItems.add(newItemId);

        return new CartSnapshot(
                UUID.randomUUID(),
                updatedItems,
                LocalDateTime.now(),
                "ADD_ITEM"
        );
    }

    /**
     * Create snapshot for removing item.
     */
    public static CartSnapshot forRemoveItem(List<Long> cartItemIds, Long removedItemId) {
        List<Long> updatedItems = cartItemIds.stream()
                .filter(id -> !id.equals(removedItemId))
                .toList();

        return new CartSnapshot(
                UUID.randomUUID(),
                updatedItems,
                LocalDateTime.now(),
                "REMOVE_ITEM"
        );
    }

    /**
     * Create snapshot for clearing cart.
     */
    public static CartSnapshot forClearCart() {
        return new CartSnapshot(
                UUID.randomUUID(),
                List.of(),
                LocalDateTime.now(),
                "CLEAR_CART"
        );
    }
}