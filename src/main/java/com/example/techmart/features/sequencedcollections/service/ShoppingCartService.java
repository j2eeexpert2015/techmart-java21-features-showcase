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
 * Service layer for managing shopping cart operations. This class contains the
 * core business logic and is where the Java 21 Sequenced Collections features are demonstrated.
 */
@Service
public class ShoppingCartService {

    private static final Logger logger = LoggerFactory.getLogger(ShoppingCartService.class);
    private static final int MAX_CART_SIZE = 50;

    // Use ConcurrentHashMap to allow safe concurrent access to different customer carts.
    // The value is a LinkedHashSet, which is a SequencedSet, to maintain insertion order.
    private final Map<Long, LinkedHashSet<CartItem>> customerCarts = new ConcurrentHashMap<>();
    private final AtomicLong cartItemIdGenerator = new AtomicLong(1);

    // Standard behavior: add a new item to the end of the cart.
    public CartItem addToCart(Customer customer, Product product, int quantity) {
        validateAddToCart(customer, product, quantity);

        LinkedHashSet<CartItem> cart = getOrCreateCart(customer.id());
        CartItem newItem;

        // Synchronize on the specific cart to prevent race conditions if multiple requests
        // for the same customer arrive at the same time.
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
            // Java 21: addLast() is the explicit way to add to the end of a sequenced collection.
            cart.addLast(newItem);
        }

        logger.info("Added {} x {} to cart for customer {}", quantity, product.name(), customer.username());
        return newItem;
    }

    // Special behavior for VIPs: add a priority item to the front of the cart.
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
            // Java 21: addFirst() places the item at the beginning of the sequence.
            cart.addFirst(priorityItem);
        }

        logger.info("Added priority item {} to front of cart for VIP customer {}", product.name(), customer.username());
        return priorityItem;
    }

    // Implements the "Undo" feature by removing the most recently added item.
    public Optional<CartItem> undoLastAddition(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) {
            return Optional.empty();
        }
        synchronized (cart) {
            if (cart.isEmpty()) return Optional.empty();
            // Java 21: removeLast() makes implementing undo functionality trivial.
            CartItem removedItem = cart.removeLast();
            logger.info("Undid last addition: removed {}", removedItem.product().name());
            return Optional.of(removedItem);
        }
    }

    /**
     * NEW: Remove specific cart item by ID
     * Demonstrates targeted removal from Java 21 Sequenced Collections
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

                // Java 21: remove() method works on SequencedSet while maintaining order
                boolean removed = cart.remove(removedItem);

                if (removed) {
                    logger.info("Removed item {} (ID: {}) from cart for customer {}",
                            removedItem.product().name(), itemId, customerId);
                    return Optional.of(removedItem);
                }
            }

            logger.warn("Attempted to remove non-existent item {} from cart for customer {}",
                    itemId, customerId);
            return Optional.empty();
        }
    }

    /**
     * NEW: Find cart item by ID
     * Helper method for finding specific items in the sequenced collection
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
     * NEW: Check if item exists in cart
     * Useful for validation before removal operations
     */
    public boolean hasCartItem(Long customerId, Long itemId) {
        return findCartItem(customerId, itemId).isPresent();
    }

    // Efficiently get the newest item without iterating through the collection.
    public Optional<CartItem> getNewestItem(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) return Optional.empty();
        // Java 21: getLast() provides direct O(1) access to the last element.
        return Optional.of(cart.getLast());
    }

    // Efficiently get the oldest item.
    public Optional<CartItem> getOldestItem(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart == null || cart.isEmpty()) return Optional.empty();
        // Java 21: getFirst() provides direct O(1) access to the first element.
        return Optional.of(cart.getFirst());
    }

    // Returns an immutable copy of the cart items, preserving their order.
    public List<CartItem> getCartItems(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        return cart != null ? List.copyOf(cart) : List.of();
    }

    // Calculates the total price of all items in the cart.
    public BigDecimal calculateCartTotal(Long customerId) {
        return getCartItems(customerId).stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getCartSize(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        return cart != null ? cart.size() : 0;
    }

    // Clears all items from a customer's cart.
    public void clearCart(Long customerId) {
        LinkedHashSet<CartItem> cart = customerCarts.get(customerId);
        if (cart != null) {
            // clear() is a standard Collection method, but it works as expected on Sequenced Collections.
            cart.clear();
            logger.info("Cleared cart for customer {}", customerId);
        }
    }

    // A helper to safely get a cart for a customer, creating one if it doesn't exist.
    private LinkedHashSet<CartItem> getOrCreateCart(Long customerId) {
        // computeIfAbsent is a thread-safe way to perform this check-and-create operation.
        return customerCarts.computeIfAbsent(customerId, k -> new LinkedHashSet<>());
    }

    // Centralized validation logic for adding items to the cart.
    private void validateAddToCart(Customer customer, Product product, int quantity) {
        if (customer == null) throw new ValidationException("Customer cannot be null.");
        if (product == null) throw new ValidationException("Product cannot be null.");
        if (quantity <= 0) throw new ValidationException("Quantity must be positive.");
        if (!product.isInStock()) throw new ValidationException("Product " + product.name() + " is out of stock.");
    }
}