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
 * FIXED: Accurate reporting of Java 21 methods actually used per operation
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
        // 1. Get cart items - NO Java 21 methods used here
        List<CartItem> items = cartService.getCartItems(customerId);
        BigDecimal total = cartService.calculateCartTotal(customerId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("customerId", customerId);
        response.put("items", items);
        response.put("itemCount", items.size());
        response.put("total", total);
        response.put("isEmpty", items.isEmpty());

        // 2. Get oldest item - USES getFirst() in service
        cartService.getOldestItem(customerId).ifPresent(oldest ->
                response.put("oldestItem", Map.of("id", oldest.id(), "name", oldest.product().name(), "addedAt", oldest.addedAt()))
        );

        // 3. Get newest item - USES getLast() in service
        cartService.getNewestItem(customerId).ifPresent(newest ->
                response.put("newestItem", Map.of("id", newest.id(), "name", newest.product().name(), "addedAt", newest.addedAt()))
        );

        // FIXED: Accurate educational metadata - reports actual methods used
        addEducationalMetadata(response,
                "CartController.getCart",
                "Multiple service calls with different Java 21 methods",
                Arrays.asList("getFirst", "getLast"),  // Only these are actually used
                "Direct access to sequence endpoints without iteration"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/items")
    public ResponseEntity<Map<String, Object>> addToCart(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer customer = createDemoCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());

        // USES addLast() in service
        CartItem addedItem = cartService.addToCart(customer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("addedItem", addedItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // FIXED: Accurate metadata reporting
        addEducationalMetadata(response,
                "CartController.addToCart",
                "ShoppingCartService.addToCart",
                Arrays.asList("addLast"),  // Only addLast is actually used
                "Item added to end of sequence maintaining insertion order"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/priority-items")
    public ResponseEntity<Map<String, Object>> addPriorityItem(
            @PathVariable Long customerId,
            @RequestBody AddToCartRequest request) {

        Customer vipCustomer = createDemoVipCustomer(customerId);
        Product product = createDemoProduct(request.productId(), request.productName(), request.price());

        // USES addFirst() in service
        CartItem priorityItem = cartService.addPriorityItem(vipCustomer, product, request.quantity());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("priorityItem", priorityItem);
        response.put("cartSize", cartService.getCartSize(customerId));

        // FIXED: Accurate metadata reporting
        addEducationalMetadata(response,
                "CartController.addPriorityItem",
                "ShoppingCartService.addPriorityItem",
                Arrays.asList("addFirst"),  // Only addFirst is actually used
                "Priority item added to front of sequence for VIP customers"
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{customerId}/undo")
    public ResponseEntity<Map<String, Object>> undoLastAction(@PathVariable Long customerId) {

        // USES removeLast() in service
        Optional<CartItem> removedItem = cartService.undoLastAddition(customerId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    createErrorResponse("No items to undo", "CartController.undoLastAction")
            );
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("undoneItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // FIXED: Accurate metadata reporting
        addEducationalMetadata(response,
                "CartController.undoLastAction",
                "ShoppingCartService.undoLastAddition",
                Arrays.asList("removeLast"),  // Only removeLast is actually used
                "Last item removed from sequence end implementing undo functionality"
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}/items/{itemId}")
    public ResponseEntity<Map<String, Object>> removeCartItem(
            @PathVariable Long customerId,
            @PathVariable Long itemId) {

        // USES remove() in service - not a Java 21 specific method
        Optional<CartItem> removedItem = cartService.removeCartItem(customerId, itemId);

        if (removedItem.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    createErrorResponse("Item not found in cart", "CartController.removeCartItem")
            );
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("removedItem", removedItem.get());
        response.put("cartSize", cartService.getCartSize(customerId));

        // FIXED: Accurate metadata - no Java 21 specific methods used
        addEducationalMetadata(response,
                "CartController.removeCartItem",
                "ShoppingCartService.removeCartItem",
                Arrays.asList(),  // No Java 21 specific methods used
                "Specific item removed from sequence while maintaining order"
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long customerId) {
        int itemCount = cartService.getCartSize(customerId);

        // USES clear() - standard Collection method, not Java 21 specific
        cartService.clearCart(customerId);
        historyService.clearHistory(customerId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("itemsRemoved", itemCount);

        // FIXED: Accurate metadata - no Java 21 specific methods
        addEducationalMetadata(response,
                "CartController.clearCart",
                "ShoppingCartService.clearCart",
                Arrays.asList(),  // No Java 21 specific methods used
                "All items removed from collection using standard clear()"
        );

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // GENERIC EDUCATIONAL METADATA METHODS - REUSABLE
    // ============================================================================

    /**
     * Generic method to add educational metadata to responses
     * REUSABLE across all controller methods
     */
    private void addEducationalMetadata(Map<String, Object> response,
                                        String controllerMethod,
                                        String serviceMethod,
                                        List<String> java21MethodsUsed,
                                        String operationDescription) {

        // Controller method with class name
        response.put("controller_method", controllerMethod);

        // Service method called
        response.put("service_method", serviceMethod);

        // Actual Java 21 methods used (empty list if none)
        response.put("java21_methods_used", java21MethodsUsed);

        // Description of what happened
        response.put("operation_description", operationDescription);

        // Java 21 feature category (only if methods were actually used)
        if (!java21MethodsUsed.isEmpty()) {
            response.put("java21_feature", "Sequenced Collections");
            response.put("jep_reference", "JEP 431: Sequenced Collections");
        }
    }

    /**
     * Generic method to add educational metadata for multiple service calls
     * Used when one controller method calls multiple service methods
     */
    private void addMultiServiceEducationalMetadata(Map<String, Object> response,
                                                    String controllerMethod,
                                                    Map<String, List<String>> serviceMethodsAndJava21Methods,
                                                    String operationDescription) {

        response.put("controller_method", controllerMethod);
        response.put("service_calls", serviceMethodsAndJava21Methods);
        response.put("operation_description", operationDescription);

        // Aggregate all Java 21 methods used
        List<String> allJava21Methods = serviceMethodsAndJava21Methods.values().stream()
                .flatMap(List::stream)
                .distinct()
                .toList();

        response.put("java21_methods_used", allJava21Methods);

        if (!allJava21Methods.isEmpty()) {
            response.put("java21_feature", "Sequenced Collections");
            response.put("jep_reference", "JEP 431: Sequenced Collections");
        }
    }

    /**
     * Generic error response with educational metadata
     */
    private Map<String, Object> createErrorResponse(String errorMessage, String controllerMethod) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("error", errorMessage);

        addEducationalMetadata(response,
                controllerMethod,
                "None - validation failed",
                Arrays.asList(),
                "Request validation failed before service call"
        );

        return response;
    }

    // ============================================================================
    // ALTERNATIVE: Enhanced getCart with detailed service call tracking
    // ============================================================================

    /**
     * ALTERNATIVE IMPLEMENTATION: More detailed tracking of multiple service calls
     */
    public ResponseEntity<Map<String, Object>> getCartDetailed(@PathVariable Long customerId) {
        Map<String, Object> response = new LinkedHashMap<>();

        // Track each service call separately
        Map<String, List<String>> serviceCalls = new LinkedHashMap<>();

        // Service call 1: Get items (no Java 21 methods)
        List<CartItem> items = cartService.getCartItems(customerId);
        serviceCalls.put("ShoppingCartService.getCartItems", Arrays.asList());

        // Service call 2: Calculate total (no Java 21 methods)
        BigDecimal total = cartService.calculateCartTotal(customerId);
        serviceCalls.put("ShoppingCartService.calculateCartTotal", Arrays.asList());

        // Service call 3: Get oldest item (uses getFirst)
        Optional<CartItem> oldestItem = cartService.getOldestItem(customerId);
        serviceCalls.put("ShoppingCartService.getOldestItem", Arrays.asList("getFirst"));

        // Service call 4: Get newest item (uses getLast)
        Optional<CartItem> newestItem = cartService.getNewestItem(customerId);
        serviceCalls.put("ShoppingCartService.getNewestItem", Arrays.asList("getLast"));

        // Build response
        response.put("customerId", customerId);
        response.put("items", items);
        response.put("total", total);

        oldestItem.ifPresent(oldest -> response.put("oldestItem",
                Map.of("id", oldest.id(), "name", oldest.product().name())));
        newestItem.ifPresent(newest -> response.put("newestItem",
                Map.of("id", newest.id(), "name", newest.product().name())));

        // Detailed educational metadata
        addMultiServiceEducationalMetadata(response,
                "CartController.getCart",
                serviceCalls,
                "Multiple service calls: getCartItems (no Java 21), getOldestItem (getFirst), getNewestItem (getLast)"
        );

        return ResponseEntity.ok(response);
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