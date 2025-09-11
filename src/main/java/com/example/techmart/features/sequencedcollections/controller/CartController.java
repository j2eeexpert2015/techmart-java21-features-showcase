package com.example.techmart.features.sequencedcollections.controller;

import com.example.techmart.features.sequencedcollections.domain.CartItem;
import com.example.techmart.features.sequencedcollections.service.CartHistoryService;
import com.example.techmart.features.sequencedcollections.service.ShoppingCartService;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.CustomerTier;
import com.example.techmart.shared.domain.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for the Sequenced Collections shopping cart demo.
 *
 * This controller exposes endpoints that the frontend UI calls to interact with the
 * shopping cart. Each method is designed to trigger a specific business logic
 * in the service layer that showcases a Java 21 Sequenced Collections feature.
 * The responses are enriched with educational metadata to be displayed in the demo's
 * Visual Flow Inspector.
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final ShoppingCartService cartService;
    private final CartHistoryService historyService;

    public CartController(ShoppingCartService cartService,
                          CartHistoryService historyService) {
        this.cartService = cartService;
        this.historyService = historyService;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Map<String, Object>> getCart(@PathVariable Long customerId) {
        List<CartItem> items = cartService.getCartItems(customerId);
        BigDecimal total = cartService.calculateCartTotal(customerId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("customerId", customerId);
        response.put("items", items);
        response.put("itemCount", items.size());
        response.put("total", total);
        response.put("isEmpty", items.isEmpty());

        cartService.getOldestItem(customerId).ifPresent(oldest ->
                response.put("oldestItem", Map.of("id", oldest.id(), "name", oldest.product().name(), "addedAt", oldest.addedAt()))
        );

        cartService.getNewestItem(customerId).ifPresent(newest ->
                response.put("newestItem", Map.of("id", newest.id(), "name", newest.product().name(), "addedAt", newest.addedAt()))
        );

        // Educational metadata
        response.put("controller_method", "getCart");
        response.put("service_method", "ShoppingCartService.getCartItems");
        response.put("java21_methods_used", Arrays.asList("getFirst", "getLast"));
        response.put("operation_description", "Direct access to sequence endpoints without iteration");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<Map<String, Object>> addToCart(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer customer = createDemoCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());
        CartItem addedItem = cartService.addToCart(customer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("addedItem", addedItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // Educational metadata
        response.put("controller_method", "addToCart");
        response.put("service_method", "ShoppingCartService.addToCart");
        response.put("java21_method_used", "addLast");
        response.put("operation_description", "Item added to end of sequence");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/priority-items")
    public ResponseEntity<Map<String, Object>> addPriorityItem(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer vipCustomer = createDemoVipCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());
        CartItem priorityItem = cartService.addPriorityItem(vipCustomer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("priorityItem", priorityItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // Educational metadata
        response.put("controller_method", "addPriorityItem");
        response.put("service_method", "ShoppingCartService.addPriorityItem");
        response.put("java21_method_used", "addFirst");
        response.put("operation_description", "Priority item added to front of sequence");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/undo")
    public ResponseEntity<Map<String, Object>> undoLastAction(@PathVariable Long customerId) {
        Optional<CartItem> removedItem = cartService.undoLastAddition(customerId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No items to undo"));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("undoneItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // Educational metadata
        response.put("controller_method", "undoLastAction");
        response.put("service_method", "ShoppingCartService.undoLastAddition");
        response.put("java21_method_used", "removeLast");
        response.put("operation_description", "Last item removed from sequence end");

        return ResponseEntity.ok(response);
    }

    /**
     * NEW: Remove specific cart item by ID
     * Demonstrates targeted removal from sequenced collection
     */
    @DeleteMapping("/{customerId}/items/{itemId}")
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @PathVariable Long customerId,
            @PathVariable Long itemId) {

        Optional<CartItem> removedItem = cartService.removeCartItem(customerId, itemId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Item not found in cart"));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("removedItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // Educational metadata
        response.put("controller_method", "removeCartItem");
        response.put("service_method", "ShoppingCartService.removeCartItem");
        response.put("java21_method_used", "remove");
        response.put("operation_description", "Specific item removed from sequence");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long customerId) {
        int itemCount = cartService.getCartSize(customerId);
        cartService.clearCart(customerId);
        historyService.clearHistory(customerId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("itemsRemoved", itemCount);

        // Educational metadata
        response.put("controller_method", "clearCart");
        response.put("service_method", "ShoppingCartService.clearCart");
        response.put("java21_method_used", "clear");
        response.put("operation_description", "All items removed from collection");

        return ResponseEntity.ok(response);
    }

    private Customer createDemoCustomer(Long customerId) {
        return new Customer(customerId, "customer" + customerId, "customer" + customerId + "@example.com", "Demo Customer", CustomerTier.BASIC, null, LocalDateTime.now(), true);
    }

    private Customer createDemoVipCustomer(Long customerId) {
        return new Customer(customerId, "vip" + customerId, "vip" + customerId + "@example.com", "VIP Customer", CustomerTier.VIP, null, LocalDateTime.now(), true);
    }

    private Product createDemoProduct(Long productId, String name, BigDecimal price) {
        return new Product(productId, name, "Demo product", price, null, List.of(), 100, true, LocalDateTime.now());
    }

    public record AddToCartRequest(Long productId, String productName, int quantity, BigDecimal price) {
        public AddToCartRequest {
            if (productId == null) throw new IllegalArgumentException("Product ID cannot be null");
        }
    }
}