package com.example.techmart.features.sequencedcollections;

import com.example.techmart.features.sequencedcollections.domain.CartItem;
import com.example.techmart.features.sequencedcollections.service.CartHistoryService;
import com.example.techmart.features.sequencedcollections.service.RecentlyViewedService;
import com.example.techmart.features.sequencedcollections.service.ShoppingCartService;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.CustomerTier;
import com.example.techmart.shared.domain.Product;
import com.example.techmart.shared.domain.ProductCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Live demonstration of Java 21 Sequenced Collections in TechMart shopping cart.
 *
 * This test class showcases practical business scenarios using:
 * - SequencedSet for cart items with ordering
 * - SequencedDeque for cart history and undo functionality
 * - getFirst()/getLast() for efficient access
 * - addFirst()/addLast() for strategic positioning
 * - remove() for targeted item removal
 * - reversed() for alternative views
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Java 21 Sequenced Collections - Shopping Cart Demo")
class SequencedCollectionsLiveDemoTest {

    private ShoppingCartService cartService;
    private RecentlyViewedService recentlyViewedService;
    private CartHistoryService historyService;

    private Customer regularCustomer;
    private Customer vipCustomer;
    private Product iphone;
    private Product airpods;
    private Product macbook;

    @BeforeEach
    void setUp() {
        cartService = new ShoppingCartService();
        recentlyViewedService = new RecentlyViewedService();
        historyService = new CartHistoryService();

        regularCustomer = new Customer(
                1L, "john_doe", "john@example.com", "John Doe",
                CustomerTier.BASIC, null, LocalDateTime.now(), true
        );

        vipCustomer = new Customer(
                2L, "vip_alice", "alice@example.com", "Alice Smith",
                CustomerTier.VIP, null, LocalDateTime.now(), true
        );

        iphone = new Product(
                1L, "iPhone 15 Pro", "Latest iPhone with titanium design",
                BigDecimal.valueOf(999.99), ProductCategory.ELECTRONICS,
                List.of("phone", "apple", "5g"), 50, true, LocalDateTime.now()
        );

        airpods = new Product(
                2L, "AirPods Pro", "Noise canceling wireless earbuds",
                BigDecimal.valueOf(249.99), ProductCategory.ELECTRONICS,
                List.of("audio", "apple", "wireless"), 30, true, LocalDateTime.now()
        );

        macbook = new Product(
                3L, "MacBook Pro M3", "Professional laptop with M3 chip",
                BigDecimal.valueOf(1999.99), ProductCategory.ELECTRONICS,
                List.of("laptop", "apple", "professional"), 20, true, LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("Demo 1: Basic Shopping Cart Operations with Sequenced Collections")
    void demonstrateBasicCartOperations() {
        System.out.println("\n=== DEMO 1: Basic Shopping Cart Operations ===");

        // Add items to cart - demonstrates addLast() behavior
        CartItem item1 = cartService.addToCart(regularCustomer, iphone, 1);
        CartItem item2 = cartService.addToCart(regularCustomer, airpods, 2);

        System.out.println("Added iPhone (ID: " + item1.id() + ") and AirPods (ID: " + item2.id() + ") to cart");

        // Java 21 Sequenced Collections: Access first and last items
        var oldestItem = cartService.getOldestItem(regularCustomer.id());
        var newestItem = cartService.getNewestItem(regularCustomer.id());

        System.out.println("Oldest item: " + oldestItem.get().product().name());
        System.out.println("Newest item: " + newestItem.get().product().name());

        // Verify ordering behavior
        assertThat(oldestItem.get().product().name()).isEqualTo("iPhone 15 Pro");
        assertThat(newestItem.get().product().name()).isEqualTo("AirPods Pro");
        assertThat(cartService.getCartSize(regularCustomer.id())).isEqualTo(2);
    }

    @Test
    @DisplayName("Demo 2: VIP Priority Items with addFirst()")
    void demonstratePriorityItemPlacement() {
        System.out.println("\n=== DEMO 2: VIP Priority Item Placement ===");

        // Add regular item first
        cartService.addToCart(vipCustomer, iphone, 1);
        System.out.println("Added iPhone to VIP cart");

        // Add priority item - should go to front
        CartItem priorityItem = cartService.addPriorityItem(vipCustomer, macbook, 1);
        System.out.println("Added MacBook as priority item (should be first)");

        var firstItem = cartService.getOldestItem(vipCustomer.id());
        var lastItem = cartService.getNewestItem(vipCustomer.id());

        System.out.println("First item: " + firstItem.get().product().name());
        System.out.println("Last item: " + lastItem.get().product().name());

        // Verify priority item is at front
        assertThat(firstItem.get().product().name()).isEqualTo("MacBook Pro M3");
        assertThat(firstItem.get().id()).isEqualTo(priorityItem.id());
        assertThat(lastItem.get().product().name()).isEqualTo("iPhone 15 Pro");
    }

    @Test
    @DisplayName("Demo 3: Undo Functionality with removeLast()")
    void demonstrateUndoFunctionality() {
        System.out.println("\n=== DEMO 3: Cart Undo Functionality ===");

        CartItem item1 = cartService.addToCart(regularCustomer, iphone, 1);
        CartItem item2 = cartService.addToCart(regularCustomer, airpods, 1);

        System.out.println("Added iPhone and AirPods to cart");
        System.out.println("Cart size before undo: " + cartService.getCartSize(regularCustomer.id()));

        var undoneItem = cartService.undoLastAddition(regularCustomer.id());
        System.out.println("Undone item: " + undoneItem.get().product().name());
        System.out.println("Cart size after undo: " + cartService.getCartSize(regularCustomer.id()));

        // Verify undo worked correctly
        assertThat(undoneItem.get().product().name()).isEqualTo("AirPods Pro");
        assertThat(cartService.getCartSize(regularCustomer.id())).isEqualTo(1);

        // Verify remaining item is the iPhone
        var remainingItem = cartService.getNewestItem(regularCustomer.id());
        assertThat(remainingItem.get().product().name()).isEqualTo("iPhone 15 Pro");
    }

    @Test
    @DisplayName("Demo 4: Recently Viewed Products LRU Cache")
    void demonstrateRecentlyViewedLruCache() {
        System.out.println("\n=== DEMO 4: Recently Viewed Products (LRU Cache) ===");

        recentlyViewedService.recordProductView(regularCustomer.id(), iphone);
        recentlyViewedService.recordProductView(regularCustomer.id(), airpods);

        System.out.println("Recorded views for iPhone and AirPods");

        var recentlyViewed = recentlyViewedService.getRecentlyViewed(regularCustomer.id());
        System.out.println("Most recently viewed: " + recentlyViewed.get(0).name());

        // Verify LRU ordering (newest first because reversed() is used)
        assertThat(recentlyViewed.get(0).name()).isEqualTo("AirPods Pro");

        // View iPhone again to test LRU behavior
        recentlyViewedService.recordProductView(regularCustomer.id(), iphone);
        var updatedRecentlyViewed = recentlyViewedService.getRecentlyViewed(regularCustomer.id());

        System.out.println("After viewing iPhone again, most recent: " + updatedRecentlyViewed.get(0).name());

        // iPhone should now be most recent
        assertThat(updatedRecentlyViewed.get(0).name()).isEqualTo("iPhone 15 Pro");
    }

    @Test
    @DisplayName("Demo 5: Cart History Tracking")
    void demonstrateCartHistoryTracking() {
        System.out.println("\n=== DEMO 5: Cart History Tracking ===");

        // Record initial state
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(), "CART_CREATED");

        // Add items and track changes
        CartItem item1 = cartService.addToCart(regularCustomer, iphone, 1);
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(item1.id()), "ADD_ITEM");

        CartItem item2 = cartService.addToCart(regularCustomer, airpods, 1);
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(item1.id(), item2.id()), "ADD_ITEM");

        System.out.println("Cart history count: " + historyService.getUndoCount(regularCustomer.id()));
        System.out.println("Changes summary: " + historyService.getChangesSummary(regularCustomer.id()));

        // Verify history tracking
        assertThat(historyService.getUndoCount(regularCustomer.id())).isEqualTo(3);
        assertThat(historyService.canUndo(regularCustomer.id())).isTrue();

        var currentSnapshot = historyService.getCurrentSnapshot(regularCustomer.id());
        assertThat(currentSnapshot).isPresent();
        assertThat(currentSnapshot.get().action()).isEqualTo("ADD_ITEM");
    }

    @Test
    @DisplayName("Demo 6: Reversed Collections View")
    void demonstrateReversedCollectionsView() {
        System.out.println("\n=== DEMO 6: Reversed Collections View ===");

        // Add multiple items
        cartService.addToCart(regularCustomer, iphone, 1);
        cartService.addToCart(regularCustomer, airpods, 1);
        cartService.addToCart(regularCustomer, macbook, 1);

        // Record history entries
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(1L), "ADD_IPHONE");
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(1L, 2L), "ADD_AIRPODS");
        historyService.saveCartSnapshot(regularCustomer.id(), List.of(1L, 2L, 3L), "ADD_MACBOOK");

        // Get history in chronological order
        var chronologicalHistory = historyService.getCartHistory(regularCustomer.id());
        System.out.println("Chronological history (oldest first):");
        chronologicalHistory.forEach(snapshot ->
                System.out.println("  " + snapshot.action() + " at " + snapshot.timestamp()));

        // Get history in reverse chronological order (newest first)
        var reverseHistory = historyService.getCartHistoryNewestFirst(regularCustomer.id());
        System.out.println("Reverse chronological history (newest first):");
        reverseHistory.forEach(snapshot ->
                System.out.println("  " + snapshot.action() + " at " + snapshot.timestamp()));

        // Verify reversed view functionality
        assertThat(chronologicalHistory.get(0).action()).isEqualTo("ADD_IPHONE");
        assertThat(reverseHistory.get(0).action()).isEqualTo("ADD_MACBOOK");
        assertThat(chronologicalHistory.size()).isEqualTo(reverseHistory.size());
    }

    @Test
    @DisplayName("Demo 7: Complete E-commerce Flow")
    void demonstrateCompleteShoppingFlow() {
        System.out.println("\n=== DEMO 7: Complete E-commerce Shopping Flow ===");

        // 1. Customer browses products (Recently Viewed)
        System.out.println("1. Customer browsing products...");
        recentlyViewedService.recordProductView(regularCustomer.id(), iphone);
        recentlyViewedService.recordProductView(regularCustomer.id(), macbook);
        recentlyViewedService.recordProductView(regularCustomer.id(), airpods);

        // 2. Add items to cart
        System.out.println("2. Adding items to cart...");
        CartItem item1 = cartService.addToCart(regularCustomer, iphone, 1);
        CartItem item2 = cartService.addToCart(regularCustomer, airpods, 2);

        // 3. Customer changes mind and removes middle item
        System.out.println("3. Customer removes iPhone from cart...");
        Optional<CartItem> removedItem = cartService.removeCartItem(regularCustomer.id(), item1.id());

        // 4. Add another item
        System.out.println("4. Customer adds MacBook to cart...");
        CartItem item3 = cartService.addToCart(regularCustomer, macbook, 1);

        // 5. Verify final state
        List<CartItem> finalCart = cartService.getCartItems(regularCustomer.id());
        System.out.println("Final cart contents:");
        finalCart.forEach(item -> System.out.println("  - " + item.product().name()));

        BigDecimal total = cartService.calculateCartTotal(regularCustomer.id());
        System.out.println("Cart total: $" + total);

        var recentlyViewed = recentlyViewedService.getRecentlyViewed(regularCustomer.id(), 3);
        System.out.println("Recently viewed products:");
        recentlyViewed.forEach(product -> System.out.println("  - " + product.name()));

        // Assertions
        assertThat(removedItem).isPresent();
        assertThat(removedItem.get().product().name()).isEqualTo("iPhone 15 Pro");
        assertThat(finalCart).hasSize(2);
        assertThat(finalCart.get(0).product().name()).isEqualTo("AirPods Pro");
        assertThat(finalCart.get(1).product().name()).isEqualTo("MacBook Pro M3");
        assertThat(total).isEqualByComparingTo(BigDecimal.valueOf(2499.97)); // 2*249.99 + 1999.99
    }

    @Test
    @DisplayName("Demo 8: NEW - Specific Item Removal")
    void demonstrateSpecificItemRemoval() {
        System.out.println("\n=== DEMO 8: Specific Item Removal ===");

        // Add multiple items to cart
        CartItem item1 = cartService.addToCart(regularCustomer, iphone, 1);
        CartItem item2 = cartService.addToCart(regularCustomer, airpods, 1);
        CartItem item3 = cartService.addToCart(regularCustomer, macbook, 1);

        System.out.println("Added 3 items to cart:");
        System.out.println("  1. iPhone (ID: " + item1.id() + ")");
        System.out.println("  2. AirPods (ID: " + item2.id() + ")");
        System.out.println("  3. MacBook (ID: " + item3.id() + ")");

        // Remove middle item (AirPods)
        System.out.println("Removing middle item (AirPods)...");
        Optional<CartItem> removedItem = cartService.removeCartItem(regularCustomer.id(), item2.id());

        // Verify removal
        assertThat(removedItem).isPresent();
        assertThat(removedItem.get().product().name()).isEqualTo("AirPods Pro");
        assertThat(cartService.getCartSize(regularCustomer.id())).isEqualTo(2);

        // Verify order is maintained
        List<CartItem> remainingItems = cartService.getCartItems(regularCustomer.id());
        System.out.println("Remaining items in order:");
        remainingItems.forEach(item -> System.out.println("  - " + item.product().name()));

        assertThat(remainingItems.get(0).product().name()).isEqualTo("iPhone 15 Pro");
        assertThat(remainingItems.get(1).product().name()).isEqualTo("MacBook Pro M3");

        // Test removing non-existent item
        System.out.println("Attempting to remove non-existent item...");
        Optional<CartItem> nonExistentRemoval = cartService.removeCartItem(regularCustomer.id(), 999L);
        assertThat(nonExistentRemoval).isEmpty();

        // Test helper methods
        assertThat(cartService.hasCartItem(regularCustomer.id(), item1.id())).isTrue();
        assertThat(cartService.hasCartItem(regularCustomer.id(), item2.id())).isFalse(); // Was removed
        assertThat(cartService.hasCartItem(regularCustomer.id(), item3.id())).isTrue();

        Optional<CartItem> foundItem = cartService.findCartItem(regularCustomer.id(), item1.id());
        assertThat(foundItem).isPresent();
        assertThat(foundItem.get().product().name()).isEqualTo("iPhone 15 Pro");
    }

    @Test
    @DisplayName("Demo 9: Edge Cases and Error Handling")
    void demonstrateEdgeCasesAndErrorHandling() {
        System.out.println("\n=== DEMO 9: Edge Cases and Error Handling ===");

        // Test removing from empty cart
        System.out.println("Testing removal from empty cart...");
        Optional<CartItem> emptyCartRemoval = cartService.removeCartItem(regularCustomer.id(), 1L);
        assertThat(emptyCartRemoval).isEmpty();

        // Test undo on empty cart
        System.out.println("Testing undo on empty cart...");
        Optional<CartItem> emptyCartUndo = cartService.undoLastAddition(regularCustomer.id());
        assertThat(emptyCartUndo).isEmpty();

        // Add item and test boundary conditions
        CartItem item = cartService.addToCart(regularCustomer, iphone, 1);
        System.out.println("Added single item to cart");

        // Test getting first and last when only one item
        Optional<CartItem> onlyFirst = cartService.getOldestItem(regularCustomer.id());
        Optional<CartItem> onlyLast = cartService.getNewestItem(regularCustomer.id());

        assertThat(onlyFirst).isPresent();
        assertThat(onlyLast).isPresent();
        assertThat(onlyFirst.get().id()).isEqualTo(onlyLast.get().id());

        System.out.println("When cart has one item, first and last are the same: " +
                onlyFirst.get().product().name());

        // Remove the only item
        System.out.println("Removing the only item...");
        Optional<CartItem> lastRemoval = cartService.removeCartItem(regularCustomer.id(), item.id());
        assertThat(lastRemoval).isPresent();
        assertThat(cartService.getCartSize(regularCustomer.id())).isEqualTo(0);

        // Test accessing empty cart
        assertThat(cartService.getOldestItem(regularCustomer.id())).isEmpty();
        assertThat(cartService.getNewestItem(regularCustomer.id())).isEmpty();
        assertThat(cartService.getCartItems(regularCustomer.id())).isEmpty();
        assertThat(cartService.calculateCartTotal(regularCustomer.id())).isEqualByComparingTo(BigDecimal.ZERO);
    }
}