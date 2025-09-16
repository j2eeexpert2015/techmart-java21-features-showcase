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
 * UPDATED: Clear service method tracking and Java 21 method documentation
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
        Map<String, Object> response = new LinkedHashMap<>();

        // === SERVICE CALL 1: Get basic cart data (no Java 21 methods) ===
        List<CartItem> items = cartService.getCartItems(customerId);
        BigDecimal total = cartService.calculateCartTotal(customerId);

        response.put("customerId", customerId);
        response.put("items", items);
        response.put("itemCount", items.size());
        response.put("total", total);
        response.put("isEmpty", items.isEmpty());

        // === SERVICE CALL 2: Get oldest item using Java 21 getFirst() ===
        // Method: ShoppingCartService.getOldestItem() → uses cart.getFirst()
        cartService.getOldestItem(customerId).ifPresent(oldest ->
                response.put("oldestItem", Map.of(
                        "id", oldest.id(),
                        "name", oldest.product().name(),
                        "addedAt", oldest.addedAt()
                ))
        );

        // === SERVICE CALL 3: Get newest item using Java 21 getLast() ===
        // Method: ShoppingCartService.getNewestItem() → uses cart.getLast()
        cartService.getNewestItem(customerId).ifPresent(newest ->
                response.put("newestItem", Map.of(
                        "id", newest.id(),
                        "name", newest.product().name(),
                        "addedAt", newest.addedAt()
                ))
        );

        // === EDUCATIONAL METADATA: Track all service methods called ===
        Map<String, List<String>> serviceMethodsUsed = new LinkedHashMap<>();
        serviceMethodsUsed.put("ShoppingCartService.getCartItems", Arrays.asList()); // No Java 21 methods
        serviceMethodsUsed.put("ShoppingCartService.calculateCartTotal", Arrays.asList()); // No Java 21 methods
        serviceMethodsUsed.put("ShoppingCartService.getOldestItem", Arrays.asList("getFirst")); // Java 21: getFirst()
        serviceMethodsUsed.put("ShoppingCartService.getNewestItem", Arrays.asList("getLast")); // Java 21: getLast()

        addMultiServiceEducationalMetadata(response,
                "CartController.getCart",
                serviceMethodsUsed,
                "Initial cart load: basic data + sequence endpoints using getFirst()/getLast()"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<Map<String, Object>> addToCart(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer customer = createDemoCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());

        // === SERVICE CALL: Add item using Java 21 addLast() ===
        // Method: ShoppingCartService.addToCart() → uses cart.addLast()
        CartItem addedItem = cartService.addToCart(customer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("addedItem", addedItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // === EDUCATIONAL METADATA: Single service method with Java 21 ===
        addEducationalMetadata(response,
                "CartController.addToCart",
                "ShoppingCartService.addToCart",
                Arrays.asList("addLast"),
                "Item added to end of sequence using addLast() - maintains insertion order"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/priority-items")
    public ResponseEntity<Map<String, Object>> addPriorityItem(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer vipCustomer = createDemoVipCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());

        // === SERVICE CALL: Add priority item using Java 21 addFirst() ===
        // Method: ShoppingCartService.addPriorityItem() → uses cart.addFirst()
        CartItem priorityItem = cartService.addPriorityItem(vipCustomer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("priorityItem", priorityItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // === EDUCATIONAL METADATA: VIP priority placement ===
        addEducationalMetadata(response,
                "CartController.addPriorityItem",
                "ShoppingCartService.addPriorityItem",
                Arrays.asList("addFirst"),
                "Priority item added to front of sequence using addFirst() - VIP customer benefit"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/undo")
    public ResponseEntity<Map<String, Object>> undoLastAction(@PathVariable Long customerId) {

        // === SERVICE CALL: Undo using Java 21 removeLast() ===
        // Method: ShoppingCartService.undoLastAddition() → uses cart.removeLast()
        Optional<CartItem> removedItem = cartService.undoLastAddition(customerId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    createErrorResponse("No items to undo", "CartController.undoLastAction")
            );
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("undoneItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // === EDUCATIONAL METADATA: Undo functionality ===
        addEducationalMetadata(response,
                "CartController.undoLastAction",
                "ShoppingCartService.undoLastAddition",
                Arrays.asList("removeLast"),
                "Undo functionality: removed last item using removeLast() - O(1) operation"
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}/items/{itemId}")
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @PathVariable Long customerId,
            @PathVariable Long itemId) {

        // === SERVICE CALL: Remove specific item (standard Collection method) ===
        // Method: ShoppingCartService.removeCartItem() → uses cart.remove()
        Optional<CartItem> removedItem = cartService.removeCartItem(customerId, itemId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    createErrorResponse("Item not found in cart", "CartController.removeCartItem")
            );
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("removedItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // === EDUCATIONAL METADATA: Standard Collection operation ===
        addEducationalMetadata(response,
                "CartController.removeCartItem",
                "ShoppingCartService.removeCartItem",
                Arrays.asList(), // No Java 21 specific methods - uses standard remove()
                "Specific item removed using standard Collection.remove() while maintaining sequence order"
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long customerId) {
        int itemCount = cartService.getCartSize(customerId);

        // === SERVICE CALL: Clear cart (standard Collection method) ===
        // Method: ShoppingCartService.clearCart() → uses cart.clear()
        cartService.clearCart(customerId);
        historyService.clearHistory(customerId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("itemsRemoved", itemCount);

        // === EDUCATIONAL METADATA: Bulk operation ===
        addEducationalMetadata(response,
                "CartController.clearCart",
                "ShoppingCartService.clearCart + CartHistoryService.clearHistory",
                Arrays.asList(), // No Java 21 specific methods - uses standard clear()
                "All items and history removed using standard Collection.clear()"
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // EDUCATIONAL METADATA METHODS - Clear Service Method Tracking
    // ============================================================================

    /**
     * Add educational metadata for single service method calls
     *
     * @param response The response map to enhance
     * @param controllerMethod The controller method name (e.g., "CartController.getCart")
     * @param serviceMethod The exact service method called (e.g., "ShoppingCartService.getOldestItem")
     * @param java21MethodsUsed List of Java 21 methods used (e.g., ["getFirst", "getLast"])
     * @param operationDescription Human-readable description of what happened
     */
    private void addEducationalMetadata(Map<String, Object> response,
                                        String controllerMethod,
                                        String serviceMethod,
                                        List<String> java21MethodsUsed,
                                        String operationDescription) {

        // === CONTROLLER LAYER ===
        response.put("controller_method", controllerMethod);

        // === SERVICE LAYER ===
        response.put("service_method", serviceMethod);

        // === JAVA 21 METHODS ACTUALLY USED ===
        response.put("java21_methods_used", java21MethodsUsed);

        // === OPERATION DESCRIPTION ===
        response.put("operation_description", operationDescription);

        // === FEATURE CLASSIFICATION ===
        if (!java21MethodsUsed.isEmpty()) {
            response.put("java21_feature", "Sequenced Collections");
            response.put("jep_reference", "JEP 431: Sequenced Collections");
            response.put("performance_benefit", getPerformanceBenefit(java21MethodsUsed));
        } else {
            response.put("collection_method", "Standard Collection API");
        }
    }

    /**
     * Add educational metadata for multiple service method calls
     * Used when one controller method calls multiple service methods
     *
     * @param response The response map to enhance
     * @param controllerMethod The controller method name
     * @param serviceMethodsAndJava21Methods Map of service methods to their Java 21 methods used
     * @param operationDescription Description of the overall operation
     */
    private void addMultiServiceEducationalMetadata(Map<String, Object> response,
                                                    String controllerMethod,
                                                    Map<String, List<String>> serviceMethodsAndJava21Methods,
                                                    String operationDescription) {

        response.put("controller_method", controllerMethod);
        response.put("service_calls", serviceMethodsAndJava21Methods);
        response.put("operation_description", operationDescription);

        // === AGGREGATE ALL JAVA 21 METHODS USED ===
        List<String> allJava21Methods = serviceMethodsAndJava21Methods.values().stream()
                .flatMap(List::stream)
                .distinct()
                .toList();

        response.put("java21_methods_used", allJava21Methods);

        if (!allJava21Methods.isEmpty()) {
            response.put("java21_feature", "Sequenced Collections");
            response.put("jep_reference", "JEP 431: Sequenced Collections");
            response.put("methods_count", allJava21Methods.size());
        }
    }

    /**
     * Get performance benefit description for Java 21 methods
     */
    private String getPerformanceBenefit(List<String> java21Methods) {
        if (java21Methods.contains("getFirst") || java21Methods.contains("getLast")) {
            return "O(1) direct access to sequence endpoints - no iteration required";
        } else if (java21Methods.contains("addFirst") || java21Methods.contains("addLast")) {
            return "O(1) insertion at sequence endpoints - maintains order efficiently";
        } else if (java21Methods.contains("removeLast")) {
            return "O(1) removal from sequence end - efficient undo implementation";
        }
        return "Efficient sequence operations with maintained ordering";
    }

    /**
     * Create error response with educational metadata
     */
    private Map<String, Object> createErrorResponse(String errorMessage, String controllerMethod) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("error", errorMessage);

        addEducationalMetadata(response,
                controllerMethod,
                "None - validation failed before service call",
                Arrays.asList(),
                "Request validation failed - no service methods executed"
        );

        return response;
    }

    // ============================================================================
    // HELPER METHODS (unchanged)
    // ============================================================================

    private Customer createDemoCustomer(Long customerId) {
        return new Customer(customerId, "customer" + customerId, "customer" + customerId + "@example.com",
                "Demo Customer", CustomerTier.BASIC, null, LocalDateTime.now(), true);
    }

    private Customer createDemoVipCustomer(Long customerId) {
        return new Customer(customerId, "vip" + customerId, "vip" + customerId + "@example.com",
                "VIP Customer", CustomerTier.VIP, null, LocalDateTime.now(), true);
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