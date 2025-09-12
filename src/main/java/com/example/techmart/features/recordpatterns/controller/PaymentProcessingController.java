package com.example.techmart.features.recordpatterns.controller;

import com.example.techmart.features.recordpatterns.domain.*;
import com.example.techmart.features.recordpatterns.service.PaymentProcessingService;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.CustomerTier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Payment Processing Controller - REST endpoints for Java 21 Pattern Matching Demo
 *
 * This controller exposes the payment processing service through REST endpoints,
 * providing interactive demonstrations of Java 21's pattern matching features.
 * Each endpoint showcases different aspects of the pattern matching logic.
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentProcessingController {

    private final PaymentProcessingService paymentService;

    public PaymentProcessingController(PaymentProcessingService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Process a payment - main demonstration endpoint
     * Shows Java 21 pattern matching with different payment methods and scenarios
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody PaymentRequest request) {

        // Create payment method based on request
        PaymentMethod paymentMethod = createPaymentMethodFromRequest(request);

        // Create customer for demo
        Customer customer = createCustomerFromRequest(request);

        // Process payment using Java 21 pattern matching
        PaymentProcessingResult result = paymentService.processPayment(
                paymentMethod,
                request.amount(),
                customer
        );

        // Build response with educational metadata
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("transactionId", result.transactionId());
        response.put("status", result.status());
        response.put("amount", result.amount());
        response.put("processingFee", result.processingFee());
        response.put("totalAmount", result.getTotalAmount());
        response.put("successful", result.isSuccessful());
        response.put("requiresAdditionalAction", result.requiresAdditionalAction());
        response.put("statusMessage", result.getStatusMessage());
        response.put("processingTimeEstimate", result.processingTimeEstimate());
        response.put("validationMessages", result.validationMessages());

        // Educational metadata for demo
        response.put("controller_method", "processPayment");
        response.put("service_method", "PaymentProcessingService.processPayment");
        response.put("java21_features_used", List.of("Pattern Matching for Switch", "Record Patterns", "Guard Conditions", "Sealed Interfaces"));
        response.put("pattern_matched", result.patternMatched());
        response.put("guard_condition", result.guardCondition());
        response.put("processing_action", result.processingAction());
        response.put("operation_description", "Advanced pattern matching with complex business rules");

        return ResponseEntity.ok(response);
    }

    /**
     * Test different scenarios for educational purposes
     * Allows frontend to trigger specific pattern matching scenarios
     */
    @PostMapping("/test-scenario")
    public ResponseEntity<Map<String, Object>> testScenario(@RequestBody ScenarioRequest request) {

        PaymentMethod paymentMethod = createPaymentMethodFromScenario(request);

        PaymentProcessingResult result = paymentService.processPaymentForDemoScenario(
                paymentMethod,
                request.amount(),
                request.customerTier(),
                request.isInternational()
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("scenario", request.scenario());
        response.put("result", result);
        response.put("pattern_matched", result.patternMatched());
        response.put("guard_condition", result.guardCondition());
        response.put("processing_action", result.processingAction());
        response.put("educational_note", getEducationalNote(result));

        // Java 21 feature demonstration metadata
        response.put("java21_demonstration", Map.of(
                "sealed_interface", "PaymentMethod with 3 implementations",
                "record_patterns", "Destructuring payment method records",
                "guard_conditions", result.guardCondition(),
                "exhaustive_matching", "No default case needed - compiler enforced"
        ));

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing statistics for demo dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProcessingStats() {
        var stats = paymentService.getProcessingStats();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalProcessed", stats.totalProcessed());
        response.put("successfulPayments", stats.successfulPayments());
        response.put("successRate", String.format("%.1f%%", stats.getSuccessRate()));
        response.put("requiresVerification", stats.requiresVerification());
        response.put("requiresApproval", stats.requiresApproval());
        response.put("declined", stats.declined());
        response.put("declineRate", String.format("%.1f%%", stats.getDeclineRate()));
        response.put("totalAmount", stats.totalAmount());

        // Educational metadata
        response.put("controller_method", "getProcessingStats");
        response.put("java21_features_used", List.of("Records", "Sealed Interfaces"));
        response.put("operation_description", "Statistics aggregation using pattern matching results");

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing history for demo review
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getProcessingHistory() {
        List<PaymentProcessingResult> history = paymentService.getProcessingHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("history", history);
        response.put("totalEntries", history.size());

        // Educational metadata
        response.put("controller_method", "getProcessingHistory");
        response.put("service_method", "PaymentProcessingService.getProcessingHistory");
        response.put("java21_features_used", List.of("Records", "Pattern Matching Results"));
        response.put("operation_description", "Historical view of pattern matching decisions");

        return ResponseEntity.ok(response);
    }

    /**
     * Clear processing history for demo reset
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory() {
        paymentService.clearHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("message", "Payment processing history cleared successfully");

        // Educational metadata
        response.put("controller_method", "clearHistory");
        response.put("operation_description", "Demo reset - clear all pattern matching results");

        return ResponseEntity.ok(response);
    }

    /**
     * Get available payment methods for demo UI
     */
    @GetMapping("/methods")
    public ResponseEntity<Map<String, Object>> getAvailablePaymentMethods() {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("paymentMethods", List.of(
                Map.of(
                        "type", "CREDIT_CARD",
                        "name", "Credit Card",
                        "description", "Visa, MasterCard, American Express",
                        "patterns", List.of("Standard processing", "High-value domestic", "High-value international"),
                        "guardConditions", List.of("amount > $1000", "isInternational", "amount > $1000 && isInternational")
                ),
                Map.of(
                        "type", "PAYPAL",
                        "name", "PayPal",
                        "description", "PayPal account payments",
                        "patterns", List.of("Standard processing", "Premium customer expedited", "Unverified account"),
                        "guardConditions", List.of("isPremiumCustomer", "!isVerified")
                ),
                Map.of(
                        "type", "BANK_TRANSFER",
                        "name", "Bank Transfer",
                        "description", "ACH bank transfers",
                        "patterns", List.of("Standard processing", "Large transfer approval", "Invalid routing"),
                        "guardConditions", List.of("amount >= $5000", "!isValidRoutingNumber")
                )
        ));

        // Educational metadata
        response.put("sealed_interface", "PaymentMethod permits CreditCard, PayPal, BankTransfer");
        response.put("java21_features", "Sealed interfaces enable exhaustive pattern matching");

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // HELPER METHODS FOR REQUEST PROCESSING
    // ============================================================================

    private PaymentMethod createPaymentMethodFromRequest(PaymentRequest request) {
        return switch (request.paymentType().toUpperCase()) {
            case "CREDIT_CARD" -> new CreditCard(
                    request.cardNumber(),
                    request.cardType(),
                    request.cvv(),
                    request.expiryMonth(),
                    request.expiryYear(),
                    request.cardholderName(),
                    request.isInternational(),
                    LocalDateTime.now()
            );

            case "PAYPAL" -> new PayPal(
                    request.email(),
                    "DEMO_ACCOUNT_" + System.currentTimeMillis(),
                    true, // Always verified for demo
                    false,
                    LocalDateTime.now()
            );

            case "BANK_TRANSFER" -> new BankTransfer(
                    request.accountNumber(),
                    request.routingNumber(),
                    request.bankName(),
                    "CHECKING",
                    request.accountHolderName(),
                    LocalDateTime.now()
            );

            default -> throw new IllegalArgumentException("Unknown payment type: " + request.paymentType());
        };
    }

    private PaymentMethod createPaymentMethodFromScenario(ScenarioRequest request) {
        return switch (request.scenario().toUpperCase()) {
            case "HIGH_VALUE_INTERNATIONAL" -> new CreditCard(
                    "4111111111111111", "VISA", "123", "12", "2025",
                    "Demo User", true, LocalDateTime.now()
            );

            case "HIGH_VALUE_DOMESTIC" -> new CreditCard(
                    "4111111111111111", "VISA", "123", "12", "2025",
                    "Demo User", false, LocalDateTime.now()
            );

            case "PREMIUM_PAYPAL" -> new PayPal(
                    "premium@example.com", "DEMO_PREMIUM", true, false, LocalDateTime.now()
            );

            case "UNVERIFIED_PAYPAL" -> new PayPal(
                    "unverified@example.com", "DEMO_UNVERIFIED", false, false, LocalDateTime.now()
            );

            case "LARGE_BANK_TRANSFER" -> new BankTransfer(
                    "1234567890", "021000021", "Demo Bank", "CHECKING",
                    "Demo User", LocalDateTime.now()
            );

            case "INVALID_ROUTING" -> new BankTransfer(
                    "1234567890", "123456789", "Demo Bank", "CHECKING",
                    "Demo User", LocalDateTime.now()
            );

            default -> new CreditCard(
                    "4111111111111111", "VISA", "123", "12", "2025",
                    "Demo User", false, LocalDateTime.now()
            );
        };
    }

    private Customer createCustomerFromRequest(PaymentRequest request) {
        CustomerTier tier = switch (request.customerTier().toUpperCase()) {
            case "PREMIUM" -> CustomerTier.PREMIUM;
            case "VIP" -> CustomerTier.VIP;
            default -> CustomerTier.BASIC;
        };

        return new Customer(
                1L,
                "demo_user",
                "demo@example.com",
                "Demo Customer",
                tier,
                null,
                LocalDateTime.now(),
                true
        );
    }

    private String getEducationalNote(PaymentProcessingResult result) {
        return switch (result.patternMatched()) {
            case "CreditCard" -> "Credit Card pattern matched with guard: " + result.guardCondition();
            case "PayPal" -> "PayPal pattern matched - note customer tier handling";
            case "BankTransfer" -> "Bank Transfer pattern with amount-based routing";
            default -> "Pattern matching demonstration completed";
        };
    }

    // ============================================================================
    // REQUEST/RESPONSE RECORDS
    // ============================================================================

    public record PaymentRequest(
            String paymentType,
            BigDecimal amount,
            String customerTier,
            boolean isInternational,

            // Credit Card fields
            String cardNumber,
            String cardType,
            String cvv,
            String expiryMonth,
            String expiryYear,
            String cardholderName,

            // PayPal fields
            String email,

            // Bank Transfer fields
            String accountNumber,
            String routingNumber,
            String bankName,
            String accountHolderName
    ) {}

    public record ScenarioRequest(
            String scenario,
            BigDecimal amount,
            String customerTier,
            boolean isInternational
    ) {}
}