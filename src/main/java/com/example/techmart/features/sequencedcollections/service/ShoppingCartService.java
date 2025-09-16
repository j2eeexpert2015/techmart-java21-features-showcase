package com.example.techmart.features.sequencedcollections.service;

import com.example.techmart.features.sequencedcollections.domain.CartItem;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.Product;
import com.example.techmart.shared.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service layer for managing shopping cart operations.
 *
 * UPDATED: Clear documentation of Java 21 Sequenced Collections usage
 *
 * This service demonstrates Java 21 Sequenced Collections features:
 * - LinkedHashSet<CartItem> implements SequencedSet in Java 21
 * - Direct access to sequence endpoints with getFirst()/getLast()
 * - Efficient insertion at sequence ends with addFirst()/addLast()
 * - Order-preserving operations throughout
 */
@Service
public class ShoppingCartService {

    private static final Logger logger = LoggerFactory.getLogger(ShoppingCartService.class);
    private static final int MAX_CART_SIZE = 50;

    // Use ConcurrentHashMap to allow safe concurrent access to different customer carts.
    // The value is a LinkedHashSet, which implements SequencedSet in Java 21
    private final Map<Long, LinkedHashSet<CartItem>> customerCarts = new ConcurrentHashMap<>();
    private final AtomicLong cartItemIdGenerator = new AtomicLong(1);

    // ============================================================================
    // JAVA 21 SEQUENCED COLLECTIONS: INSERTION METHODS
    // ============================================================================

    /**
     * Add item to cart using Java 21 addLast() - Standard cart behavior
     *
     * SERVICE METHOD: addToCart
     * JAVA 21 METHOD USED: addLast()
     * PERFORMANCE: O(1) insertion at sequence end
     * BUSINESS LOGIC: Items added in chronological order (FIFO)
     */
    public CartItem addToCart(Customer customer, Product product, int quantity) {
        validateAddToCart(customer, product, quantity);

        LinkedHashSet<CartItem> cart = getOrCreateCart(customer.id());
        CartItem newItem;

        synchronized (cart) {
            if (cart.size() >= MAX_CART_SIZE) {
                throw new ValidationException("Cart is full.");
            }
            newItem = new CartItem(
                    cartItemIdGenerator.getAndIncrement(),
                    product,
                    quantity,
                    product.price(),
                    LocalDateTime.now()
            );

            // === JAVA 21 FEATURE: addLast() ===
            // Explicitly adds to the END of the sequence
            // Alternative to add() with clear semantic intent
            cart.addLast(newItem);

            logger.info("✅ Java 21: addLast() - Added {} to END of cart for customer {}",
                    product.name(), customer.username());
        }

        return newItem;
    }

    /**
     * Add priority item using Java 21 addFirst() - VIP customer benefit
     *
     * SERVICE METHOD: addPriorityItem
     * JAVA 21 METHOD USED: addFirst()
     * PERFORMANCE: O(1) insertion at sequence start
     * BUSINESS LOGIC: VIP items get front-of-line placement
     */
    public CartItem addPriorityItem(Customer customer, Product product, int quantity) {
        validateAddToCart(customer, product, quantity);
        if (!customer.isVip()) {
            throw new ValidationException("Priority placement is for VIP customers only.");
        }

        LinkedHashSet<CartItem> cart = getOrCreateCart(customer.id());
        CartItem priorityItem;

        synchronized (cart) {
            priorityItem = new CartItem(
                    cartItemIdGenerator.getAndIncrement(),
                    product,
                    quantity,
                    product.price(),
                    LocalDateTime.now()
            );

            // === JAVA 21 FEATURE: addFirst() ===
            // Places item at the BEGINNING of the sequence
            // Provides VIP priority positioning
            cart.addFirst(priorityItem);

            logger.info("⭐ Java 21: addFirst() - Added {} to FRONT of cart for VIP customer {}",
                    product.name(), customer.username());
        }

        return priorityItem;
    }

    // ============================================================================
    // JAVA 21 SEQUENCED COLLECTIONS: REMOVAL METHODS
    // ============================================================================

    /**
     * Undo last addition using Java 21 removeLast() - Efficient undo functionality
     *
     * SERVICE METHOD: undoLastAddition
     * JAVA 21 METHOD USED: removeLast()
     * PERFORMANCE: O(1) removal from sequence end
     * BUSINESS LOGIC: LIFO undo behavior (remove most recent addition)
     */
    public Optional<CartItem> undoLastAddition(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) {
            return Optional.empty();
        }

        synchronized (cart) {
            if (cart.isEmpty()) return Optional.empty();

            // === JAVA 21 FEATURE: removeLast() ===
            // Directly removes the LAST item in sequence
            // No iteration required - O(1) operation
            CartItem removedItem = cart.removeLast();

            logger.info("🔄 Java 21: removeLast() - Undid last addition: removed {}",
                    removedItem.product().name());
            return Optional.of(removedItem);
        }
    }

    /**
     * Remove specific cart item by ID - Standard Collection method
     *
     * SERVICE METHOD: removeCartItem
     * JAVA 21 METHOD USED: None (uses standard remove())
     * PERFORMANCE: O(n) search + O(1) removal
     * BUSINESS LOGIC: Targeted item removal while preserving sequence order
     */
    public Optional<CartItem> removeCartItem(Long customerId, Long itemId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) {
            return Optional.empty();
        }

        synchronized (cart) {
            // Find the item to remove
            Optional<CartItem> itemToRemove = cart.stream()
                    .filter(item -> item.id().equals(itemId))
                    .findFirst();

            if (itemToRemove.isPresent()) {
                CartItem removedItem = itemToRemove.get();

                // === STANDARD COLLECTION METHOD: remove() ===
                // Not a Java 21 specific method, but works on SequencedSet
                // Maintains insertion order of remaining items
                boolean removed = cart.remove(removedItem);

                if (removed) {
                    logger.info("❌ Standard: remove() - Removed item {} (ID: {}) from cart for customer {}",
                            removedItem.product().name(), itemId, customerId);
                    return Optional.of(removedItem);
                }
            }

            logger.warn("⚠️  Attempted to remove non-existent item {} from cart for customer {}",
                    itemId, customerId);
            return Optional.empty();
        }
    }

    // ============================================================================
    // JAVA 21 SEQUENCED COLLECTIONS: ACCESS METHODS
    // ============================================================================

    /**
     * Get newest (most recently added) item using Java 21 getLast()
     *
     * SERVICE METHOD: getNewestItem
     * JAVA 21 METHOD USED: getLast()
     * PERFORMANCE: O(1) direct access to sequence end
     * BUSINESS LOGIC: Shows most recent customer addition
     * UI PURPOSE: Can display "Last Added" badge in frontend
     */
    public Optional<CartItem> getNewestItem(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) return Optional.empty();

        // === JAVA 21 FEATURE: getLast() ===
        // Direct O(1) access to the LAST element in sequence
        // No iteration through collection required
        CartItem newestItem = cart.getLast();

        logger.debug("🔍 Java 21: getLast() - Retrieved newest item: {} for customer {}",
                newestItem.product().name(), customerId);

        return Optional.of(newestItem);
    }

    /**
     * Get oldest (first added) item using Java 21 getFirst()
     *
     * SERVICE METHOD: getOldestItem
     * JAVA 21 METHOD USED: getFirst()
     * PERFORMANCE: O(1) direct access to sequence start
     * BUSINESS LOGIC: Shows first customer addition
     * UI PURPOSE: Can display "First Added" badge in frontend
     */
    public Optional<CartItem> getOldestItem(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) return Optional.empty();

        // === JAVA 21 FEATURE: getFirst() ===
        // Direct O(1) access to the FIRST element in sequence
        // Replaces iterator().next() pattern
        CartItem oldestItem = cart.getFirst();

        logger.debug("🔍 Java 21: getFirst() - Retrieved oldest item: {} for customer {}",
                oldestItem.product().name(), customerId);

        return Optional.of(oldestItem);
    }

    // ============================================================================
    // STANDARD COLLECTION METHODS (No Java 21 specific features)
    // ============================================================================

    /**
     * Get all cart items in insertion order - Standard Collection method
     *
     * SERVICE METHOD: getCartItems
     * JAVA 21 METHOD USED: None (uses standard iteration)
     * PERFORMANCE: O(n) to create immutable copy
     * BUSINESS LOGIC: Returns all items preserving insertion order
     */
    public List<CartItem> getCartItems(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);

        // === STANDARD COLLECTION: List.copyOf() ===
        // Creates immutable copy preserving SequencedSet ordering
        List<CartItem> items = cart != null ? List.copyOf(cart) : List.of();

        logger.debug("📋 Standard: List.copyOf() - Retrieved {} items for customer {}",
                items.size(), customerId);

        return items;
    }

    /**
     * Calculate cart total - Standard Collection method
     *
     * SERVICE METHOD: calculateCartTotal
     * JAVA 21 METHOD USED: None (uses Stream API)
     * PERFORMANCE: O(n) iteration for calculation
     */
    public BigDecimal calculateCartTotal(Long customerId) {
        BigDecimal total = getCartItems(customerId).stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        logger.debug("💰 Standard: Stream.reduce() - Calculated total ${} for customer {}",
                total, customerId);

        return total;
    }

    /**
     * Get cart size - Standard Collection method
     *
     * SERVICE METHOD: getCartSize
     * JAVA 21 METHOD USED: None (uses standard size())
     */
    public int getCartSize(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        int size = cart != null ? cart.size() : 0;

        logger.debug("📊 Standard: size() - Cart size {} for customer {}", size, customerId);

        return size;
    }

    /**
     * Clear cart - Standard Collection method
     *
     * SERVICE METHOD: clearCart
     * JAVA 21 METHOD USED: None (uses standard clear())
     */
    public void clearCart(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart != null) {
            int itemCount = cart.size();

            // === STANDARD COLLECTION: clear() ===
            // Removes all elements but preserves SequencedSet structure
            cart.clear();

            logger.info("🧹 Standard: clear() - Cleared {} items from cart for customer {}",
                    itemCount, customerId);
        }
    }

    // ============================================================================
    // HELPER METHODS FOR ITEM OPERATIONS
    // ============================================================================

    /**
     * Find cart item by ID - Standard Collection method
     *
     * SERVICE METHOD: findCartItem
     * JAVA 21 METHOD USED: None (uses Stream API)
     */
    public Optional<CartItem> findCartItem(Long customerId, Long itemId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) {
            return Optional.empty();
        }

        return cart.stream()
                .filter(item -> item.id().equals(itemId))
                .findFirst();
    }

    /**
     * Check if item exists in cart - Standard Collection method
     *
     * SERVICE METHOD: hasCartItem
     * JAVA 21 METHOD USED: None (delegates to findCartItem)
     */
    public boolean hasCartItem(Long customerId, Long itemId) {
        return findCartItem(customerId, itemId).isPresent();
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    /**
     * Get or create cart for customer - uses LinkedHashSet (SequencedSet in Java 21)
     */
    private LinkedHashSet<CartItem> getOrCreateCart(Long customerId) {
        // === CREATES JAVA 21 SEQUENCEDSET ===
        // LinkedHashSet implements SequencedSet interface in Java 21
        // Provides both Set uniqueness and sequence ordering
        return customerCarts.computeIfAbsent(customerId, k -> {
            logger.info("🆕 Creating new SequencedSet cart for customer {}", customerId);
            return new LinkedHashSet<>();
        });
    }

    /**
     * Centralized validation logic for adding items to cart
     */
    private void validateAddToCart(Customer customer, Product product, int quantity) {
        if (customer == null) throw new ValidationException("Customer cannot be null.");
        if (product == null) throw new ValidationException("Product cannot be null.");
        if (quantity <= 0) throw new ValidationException("Quantity must be positive.");
        if (!product.isInStock()) throw new ValidationException("Product " + product.name() + " is out of stock.");
    }
}