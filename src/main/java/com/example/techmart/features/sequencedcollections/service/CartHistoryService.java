package com.example.techmart.features.sequencedcollections.service;

import com.example.techmart.features.sequencedcollections.domain.CartSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Cart history service for maintaining cart state snapshots using Java 21 Sequenced Collections.
 *
 * Features demonstrated:
 * - Deque (which implements SequencedCollection in Java 21) for maintaining chronological cart history
 * - addLast() for appending new snapshots
 * - removeLast()/removeFirst() for undo/redo operations
 * - getLast() for current state access
 */
@Service
public class CartHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(CartHistoryService.class);
    private static final int MAX_HISTORY_SIZE = 10;

    // Customer cart histories stored in memory for demo
    private final Map<Long, Deque<CartSnapshot>> customerHistories = new ConcurrentHashMap<>();

    /**
     * Save current cart state as a snapshot.
     * Uses addLast() to append to history chronologically.
     */
    public void saveCartSnapshot(Long customerId, List<Long> cartItemIds, String action) {
        if (customerId == null || cartItemIds == null) {
            logger.warn("Invalid parameters for cart snapshot");
            return;
        }

        Deque<CartSnapshot> history = getOrCreateHistory(customerId);

        CartSnapshot snapshot = new CartSnapshot(
                UUID.randomUUID(),
                List.copyOf(cartItemIds),
                LocalDateTime.now(),
                action
        );

        // Java 21 Sequenced Collections: Add to end of history
        history.addLast(snapshot);

        // Maintain history size limit
        while (history.size() > MAX_HISTORY_SIZE) {
            CartSnapshot removed = history.removeFirst();
            logger.debug("Removed old cart snapshot {} for customer {}",
                    removed.action(), customerId);
        }

        logger.debug("Saved cart snapshot for action '{}' for customer {}", action, customerId);
    }

    /**
     * Get the most recent cart snapshot.
     * Demonstrates getLast() for accessing current state.
     */
    public Optional<CartSnapshot> getCurrentSnapshot(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history == null || history.isEmpty()) {
            return Optional.empty();
        }

        // Java 21 Sequenced Collections: Get last (current) snapshot
        return Optional.of(history.getLast());
    }

    /**
     * Undo last cart action by removing most recent snapshot.
     * Demonstrates removeLast() for undo functionality.
     */
    public Optional<CartSnapshot> undoLastAction(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history == null || history.isEmpty()) {
            return Optional.empty();
        }

        // Java 21 Sequenced Collections: Remove and return last snapshot
        CartSnapshot undoneSnapshot = history.removeLast();

        logger.info("Undid cart action '{}' for customer {}",
                undoneSnapshot.action(), customerId);

        return Optional.of(undoneSnapshot);
    }

    /**
     * Get previous cart state (before current).
     * Useful for comparing changes.
     */
    public Optional<CartSnapshot> getPreviousSnapshot(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history == null || history.size() < 2) {
            return Optional.empty();
        }

        // Convert to list to access second-to-last element
        List<CartSnapshot> historyList = List.copyOf(history);
        return Optional.of(historyList.get(historyList.size() - 2));
    }

    /**
     * Get complete cart history in chronological order.
     */
    public List<CartSnapshot> getCartHistory(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);
        return history != null ? List.copyOf(history) : List.of();
    }

    /**
     * Get cart history in reverse chronological order (newest first).
     * Demonstrates reversed() for backwards iteration.
     */
    public List<CartSnapshot> getCartHistoryNewestFirst(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history == null || history.isEmpty()) {
            return List.of();
        }

        // Java 21 Sequenced Collections: Reverse without copying collection
        return List.copyOf(history.reversed());
    }

    /**
     * Get limited number of recent cart actions.
     */
    public List<CartSnapshot> getRecentActions(Long customerId, int limit) {
        List<CartSnapshot> historyNewestFirst = getCartHistoryNewestFirst(customerId);

        if (limit <= 0 || limit >= historyNewestFirst.size()) {
            return historyNewestFirst;
        }

        return historyNewestFirst.subList(0, limit);
    }

    /**
     * Check if undo is possible (history exists).
     */
    public boolean canUndo(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);
        return history != null && !history.isEmpty();
    }

    /**
     * Get count of available undo actions.
     */
    public int getUndoCount(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);
        return history != null ? history.size() : 0;
    }

    /**
     * Clear all cart history for a customer.
     */
    public void clearHistory(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history != null) {
            int count = history.size();
            history.clear();
            logger.info("Cleared {} cart history snapshots for customer {}", count, customerId);
        }
    }

    /**
     * Get oldest cart snapshot.
     * Demonstrates getFirst() for accessing earliest state.
     */
    public Optional<CartSnapshot> getOldestSnapshot(Long customerId) {
        Deque<CartSnapshot> history = customerHistories.get(customerId);

        if (history == null || history.isEmpty()) {
            return Optional.empty();
        }

        // Java 21 Sequenced Collections: Get first snapshot
        return Optional.of(history.getFirst());
    }

    /**
     * Compare current cart with previous state.
     * Returns a summary of changes.
     */
    public String getChangesSummary(Long customerId) {
        Optional<CartSnapshot> current = getCurrentSnapshot(customerId);
        Optional<CartSnapshot> previous = getPreviousSnapshot(customerId);

        if (current.isEmpty()) {
            return "No cart history available";
        }

        if (previous.isEmpty()) {
            return "First cart action: " + current.get().action();
        }

        CartSnapshot currentSnapshot = current.get();
        CartSnapshot previousSnapshot = previous.get();

        int currentSize = currentSnapshot.cartItemIds().size();
        int previousSize = previousSnapshot.cartItemIds().size();
        int sizeDifference = currentSize - previousSize;

        String changeDirection = sizeDifference > 0 ? "added" : "removed";
        int changeCount = Math.abs(sizeDifference);

        return String.format("Action '%s': %s %d item(s). Cart size: %d → %d",
                currentSnapshot.action(),
                changeDirection,
                changeCount,
                previousSize,
                currentSize);
    }

    // Private helper methods

    private Deque<CartSnapshot> getOrCreateHistory(Long customerId) {
        return customerHistories.computeIfAbsent(customerId, k -> new ArrayDeque<>());
    }
}