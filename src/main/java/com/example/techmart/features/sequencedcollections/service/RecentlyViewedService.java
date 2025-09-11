package com.example.techmart.features.sequencedcollections.service;

import com.example.techmart.shared.domain.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Recently viewed products service using Java 21 Sequenced Collections for LRU cache.
 *
 * Features demonstrated:
 * - SequencedSet (LinkedHashSet implements SequencedSet in Java 21) as LRU cache with automatic ordering
 * - removeFirst() for evicting oldest viewed items
 * - addLast() for adding newly viewed items
 * - Efficient size management without manual iteration
 */
@Service
public class RecentlyViewedService {

    private static final Logger logger = LoggerFactory.getLogger(RecentlyViewedService.class);
    private static final int MAX_RECENTLY_VIEWED = 20;

    // Customer recently viewed products stored in memory for demo
    private final Map<Long, LinkedHashSet<Product>> customerRecentlyViewed = new ConcurrentHashMap<>();

    /**
     * Record that a customer viewed a product.
     * Implements LRU behavior using SequencedSet.
     */
    public void recordProductView(Long customerId, Product product) {
        if (customerId == null || product == null) {
            logger.warn("Invalid parameters for product view recording");
            return;
        }

        LinkedHashSet<Product> recentlyViewed = getOrCreateRecentlyViewed(customerId);

        // Remove product if already exists (to update position)
        recentlyViewed.remove(product);

        // Add to end as most recently viewed
        recentlyViewed.addLast(product);

        // Maintain size limit using Java 21 removeFirst()
        while (recentlyViewed.size() > MAX_RECENTLY_VIEWED) {
            Product evicted = recentlyViewed.removeFirst();
            logger.debug("Evicted {} from recently viewed for customer {}",
                    evicted.name(), customerId);
        }

        logger.debug("Recorded view of {} for customer {}", product.name(), customerId);
    }

    /**
     * Get recently viewed products in order (most recent first).
     * Demonstrates reversed() for LRU ordering.
     */
    public List<Product> getRecentlyViewed(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);

        if (recentlyViewed == null || recentlyViewed.isEmpty()) {
            return List.of();
        }

        // Java 21 Sequenced Collections: Return in reverse order (newest first)
        return List.copyOf(recentlyViewed.reversed());
    }

    /**
     * Get recently viewed products in chronological order (oldest first).
     */
    public List<Product> getRecentlyViewedChronological(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);
        return recentlyViewed != null ? List.copyOf(recentlyViewed) : List.of();
    }

    /**
     * Get the most recently viewed product.
     * Demonstrates getLast() for accessing newest item.
     */
    public Optional<Product> getMostRecentlyViewed(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);

        if (recentlyViewed == null || recentlyViewed.isEmpty()) {
            return Optional.empty();
        }

        // Java 21 Sequenced Collections: Get last item
        return Optional.of(recentlyViewed.getLast());
    }

    /**
     * Get the oldest viewed product still in history.
     * Demonstrates getFirst() for accessing oldest item.
     */
    public Optional<Product> getOldestViewed(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);

        if (recentlyViewed == null || recentlyViewed.isEmpty()) {
            return Optional.empty();
        }

        // Java 21 Sequenced Collections: Get first item
        return Optional.of(recentlyViewed.getFirst());
    }

    /**
     * Get limited number of recently viewed products.
     * Useful for recommendation widgets.
     */
    public List<Product> getRecentlyViewed(Long customerId, int limit) {
        List<Product> allRecentlyViewed = getRecentlyViewed(customerId);

        if (limit <= 0 || limit >= allRecentlyViewed.size()) {
            return allRecentlyViewed;
        }

        return allRecentlyViewed.subList(0, limit);
    }

    /**
     * Check if customer has viewed a specific product recently.
     */
    public boolean hasViewedRecently(Long customerId, Product product) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);
        return recentlyViewed != null && recentlyViewed.contains(product);
    }

    /**
     * Clear all recently viewed products for a customer.
     */
    public void clearRecentlyViewed(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);

        if (recentlyViewed != null) {
            int count = recentlyViewed.size();
            recentlyViewed.clear();
            logger.info("Cleared {} recently viewed items for customer {}", count, customerId);
        }
    }

    /**
     * Get count of recently viewed products.
     */
    public int getRecentlyViewedCount(Long customerId) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);
        return recentlyViewed != null ? recentlyViewed.size() : 0;
    }

    /**
     * Remove specific product from recently viewed.
     */
    public boolean removeFromRecentlyViewed(Long customerId, Product product) {
        LinkedHashSet<Product> recentlyViewed = customerRecentlyViewed.get(customerId);

        if (recentlyViewed == null) {
            return false;
        }

        boolean removed = recentlyViewed.remove(product);

        if (removed) {
            logger.debug("Removed {} from recently viewed for customer {}",
                    product.name(), customerId);
        }

        return removed;
    }

    /**
     * Get products for recommendation based on viewing patterns.
     * Returns products by category frequency from recent views.
     */
    public List<Product> getRecommendationSeeds(Long customerId) {
        List<Product> recentlyViewed = getRecentlyViewed(customerId);

        if (recentlyViewed.isEmpty()) {
            return List.of();
        }

        // Take up to 5 most recent items for recommendation seeding
        int limit = Math.min(5, recentlyViewed.size());
        return recentlyViewed.subList(0, limit);
    }

    // Private helper methods

    private LinkedHashSet<Product> getOrCreateRecentlyViewed(Long customerId) {
        return customerRecentlyViewed.computeIfAbsent(customerId, k -> new LinkedHashSet<>());
    }
}