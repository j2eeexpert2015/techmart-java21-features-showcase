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
 * Payment Processing Controller - Enhanced for Visual Flow Inspector
 *
 * This controller provides the same level of educational metadata as the shopping cart demo,
 * enabling clear visualization of Java 21 pattern matching features in action.
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentProcessingController {

    private final PaymentProcessingService paymentService;

    public PaymentProcessingController(PaymentProcessingService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Main payment processing endpoint - Enhanced with detailed educational metadata
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody PaymentRequest request) {

        // Create payment method from request
        PaymentMethod paymentMethod = createPaymentMethodFromRequest(request);

        // Create demo customer
        Customer customer = createDemoCustomer(request);

        // Process payment using Java 21 pattern matching
        PaymentProcessingResult result = paymentService.processPayment(
                paymentMethod, request.amount(), customer
        );

        // Build comprehensive response with educational metadata (matching shopping cart style)
        Map<String, Object> response = new LinkedHashMap<>();

        // === BASIC RESULT DATA ===
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

        // === EDUCATIONAL METADATA (matching shopping cart demo format) ===
        response.put("controller_method", "processPayment");
        response.put("service_method", "PaymentProcessingService.processPayment");

        // Java 21 features used (for highlighting in UI)
        response.put("java21_features_used", List.of(
                "Pattern Matching for Switch",
                "Record Patterns",
                "Guard Conditions",
                "Sealed Interfaces",
                "Record Destructuring",
                "Exhaustive Matching"
        ));

        // Specific Java 21 method equivalent (like shopping cart's getFirst, getLast)
        response.put("java21_method_used", getJava21MethodName(result));

        // Pattern matching details
        response.put("pattern_matched", result.patternMatched());
        response.put("guard_condition", result.guardCondition());
        response.put("processing_action", result.processingAction());

        // Operation description (like shopping cart's operation_description)
        response.put("operation_description", getOperationDescription(result));

        // Additional educational context
        response.put("record_components_extracted", getRecordComponentsCount(paymentMethod));
        response.put("business_rule_applied", getBusinessRuleDescription(result));
        response.put("pattern_matching_path", getPatternMatchingPath(result));

        return ResponseEntity.ok(response);
    }

    /**
     * Test scenario endpoint - for educational demonstrations
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

        // Enhanced educational metadata for scenarios
        response.put("java21_demonstration", Map.of(
                "sealed_interface", "PaymentMethod with 3 implementations",
                "record_patterns", "Destructuring " + result.patternMatched() + " record components",
                "guard_conditions", result.guardCondition(),
                "exhaustive_matching", "No default case needed - compiler enforced",
                "type_safety", "Automatic casting and validation"
        ));

        // Visual flow metadata (matching shopping cart format)
        response.put("controller_method", "testScenario");
        response.put("service_method", "PaymentProcessingService.processPaymentForDemoScenario");
        response.put("java21_method_used", getJava21MethodName(result));
        response.put("operation_description", "Demo scenario: " + getScenarioDescription(request.scenario()));

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing statistics - Enhanced with educational metadata
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProcessingStats() {
        PaymentProcessingStats stats = paymentService.getProcessingStats();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalProcessed", stats.totalProcessed());
        response.put("successfulPayments", stats.successfulPayments());
        response.put("successRate", String.format("%.1f%%", stats.getSuccessRate()));
        response.put("requiresVerification", stats.requiresVerification());
        response.put("requiresApproval", stats.requiresApproval());
        response.put("declined", stats.declined());
        response.put("declineRate", String.format("%.1f%%", stats.getDeclineRate()));
        response.put("totalAmount", stats.totalAmount());

        // Educational metadata (matching shopping cart format)
        response.put("controller_method", "getProcessingStats");
        response.put("service_method", "PaymentProcessingService.getProcessingStats");
        response.put("java21_features_used", List.of("Records", "Sealed Interfaces", "Pattern Matching Results"));
        response.put("operation_description", "Statistics aggregation from pattern matching decisions");

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing history - Enhanced with educational metadata
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getProcessingHistory() {
        List<PaymentProcessingResult> history = paymentService.getProcessingHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("history", history);
        response.put("totalEntries", history.size());

        // Educational metadata (matching shopping cart format)
        response.put("controller_method", "getProcessingHistory");
        response.put("service_method", "PaymentProcessingService.getProcessingHistory");
        response.put("java21_features_used", List.of("Records", "Pattern Matching Results", "Immutable Data"));
        response.put("operation_description", "Historical view of pattern matching decisions");

        return ResponseEntity.ok(response);
    }

    /**
     * Clear processing history - Enhanced with educational metadata
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory() {
        paymentService.clearHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("message", "Payment processing history cleared successfully");

        // Educational metadata (matching shopping cart format)
        response.put("controller_method", "clearHistory");
        response.put("service_method", "PaymentProcessingService.clearHistory");
        response.put("operation_description", "Demo reset - clear all pattern matching results");

        return ResponseEntity.ok(response);
    }

    /**
     * Get available payment methods - Enhanced with educational metadata
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
                        "guardConditions", List.of("amount > $1000", "isInternational", "amount > $1000 && isInternational"),
                        "recordComponents", 8
                ),
                Map.of(
                        "type", "PAYPAL",
                        "name", "PayPal",
                        "description", "PayPal account payments",
                        "patterns", List.of("Standard processing", "Premium customer expedited", "Unverified account"),
                        "guardConditions", List.of("isPremiumCustomer", "!isVerified"),
                        "recordComponents", 5
                ),
                Map.of(
                        "type", "BANK_TRANSFER",
                        "name", "Bank Transfer",
                        "description", "ACH bank transfers",
                        "patterns", List.of("Standard processing", "Large transfer approval", "Invalid routing"),
                        "guardConditions", List.of("amount >= $5000", "!isValidRoutingNumber"),
                        "recordComponents", 6
                )
        ));

        // Educational metadata about sealed interface
        response.put("sealed_interface", "PaymentMethod permits CreditCard, PayPal, BankTransfer");
        response.put("java21_features", "Sealed interfaces enable exhaustive pattern matching");
        response.put("compiler_guarantee", "All payment types must be handled - no default case needed");

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // HELPER METHODS - Enhanced for educational metadata
    // ============================================================================

    /**
     * Get Java 21 method name equivalent (like shopping cart's getFirst, getLast)
     */
    private String getJava21MethodName(PaymentProcessingResult result) {
        return switch (result.patternMatched()) {
            case "CreditCard" -> "switch-pattern-match";
            case "PayPal" -> "guard-condition-match";
            case "BankTransfer" -> "amount-guard-match";
            default -> "pattern-match";
        };
    }

    /**
     * Get operation description (matching shopping cart format)
     */
    private String getOperationDescription(PaymentProcessingResult result) {
        if (!"none".equals(result.guardCondition())) {
            return "Pattern matched with guard condition: " + result.guardCondition();
        } else {
            return "Standard pattern matching without guards";
        }
    }

    /**
     * Get number of record components extracted
     */
    private int getRecordComponentsCount(PaymentMethod paymentMethod) {
        return switch (paymentMethod) {
            case CreditCard cc -> 8; // number, type, cvv, month, year, name, international, createdAt
            case PayPal pp -> 5;     // email, accountId, isVerified, saveForFuture, createdAt
            case BankTransfer bt -> 6; // account, routing, bankName, accountType, holderName, createdAt
        };
    }

    /**
     * Get business rule description
     */
    private String getBusinessRuleDescription(PaymentProcessingResult result) {
        return switch (result.status()) {
            case APPROVED -> "Standard processing rules applied";
            case REQUIRES_VERIFICATION -> "Security verification required by business rules";
            case REQUIRES_APPROVAL -> "Manager approval required by policy";
            case DECLINED -> "Transaction declined due to validation failure";
            default -> "Processing rules applied";
        };
    }

    /**
     * Get pattern matching path for educational purposes
     */
    private String getPatternMatchingPath(PaymentProcessingResult result) {
        String pattern = result.patternMatched();
        String guard = result.guardCondition();

        if ("none".equals(guard)) {
            return pattern + " → Standard Path";
        } else {
            return pattern + " → Guard: " + guard + " → " + result.processingAction();
        }
    }

    /**
     * Create payment method from request
     */
    private PaymentMethod createPaymentMethodFromRequest(PaymentRequest request) {
        return switch (request.paymentType().toUpperCase()) {
            case "CREDIT_CARD" -> new CreditCard(
                    request.cardNumber() != null ? request.cardNumber() : "4111111111111111",
                    request.cardType() != null ? request.cardType() : "VISA",
                    request.cvv() != null ? request.cvv() : "123",
                    request.expiryMonth() != null ? request.expiryMonth() : "12",
                    request.expiryYear() != null ? request.expiryYear() : "2026",
                    request.cardholderName() != null ? request.cardholderName() : "Demo User",
                    request.isInternational(),
                    LocalDateTime.now()
            );

            case "PAYPAL" -> new PayPal(
                    request.email() != null ? request.email() : "demo@example.com",
                    "DEMO_ACCOUNT_" + System.currentTimeMillis(),
                    true, // Always verified for demo
                    false,
                    LocalDateTime.now()
            );

            case "BANK_TRANSFER" -> new BankTransfer(
                    request.accountNumber() != null ? request.accountNumber() : "1234567890",
                    request.routingNumber() != null ? request.routingNumber() : "021000021",
                    request.bankName() != null ? request.bankName() : "Demo Bank",
                    "CHECKING",
                    request.accountHolderName() != null ? request.accountHolderName() : "Demo User",
                    LocalDateTime.now()
            );

            default -> throw new IllegalArgumentException("Unknown payment type: " + request.paymentType());
        };
    }

    /**
     * Create demo customer from request
     */
    private Customer createDemoCustomer(PaymentRequest request) {
        CustomerTier tier = CustomerTier.BASIC;
        try {
            if (request.customerTier() != null) {
                tier = CustomerTier.valueOf(request.customerTier().toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            // Default to BASIC if invalid tier
        }

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

    /**
     * Create payment method from scenario
     */
    private PaymentMethod createPaymentMethodFromScenario(ScenarioRequest request) {
        return switch (request.scenario().toUpperCase()) {
            case "HIGH_VALUE_INTERNATIONAL" -> new CreditCard(
                    "4111111111111111", "VISA", "123", "12", "2026",
                    "Demo User", true, LocalDateTime.now()
            );

            case "HIGH_VALUE_DOMESTIC" -> new CreditCard(
                    "4111111111111111", "VISA", "123", "12", "2026",
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
                    "4111111111111111", "VISA", "123", "12", "2026",
                    "Demo User", false, LocalDateTime.now()
            );
        };
    }

    /**
     * Get educational note for scenario
     */
    private String getEducationalNote(PaymentProcessingResult result) {
        return switch (result.patternMatched()) {
            case "CreditCard" -> "Credit Card pattern matched with guard: " + result.guardCondition();
            case "PayPal" -> "PayPal pattern matched - note customer tier handling";
            case "BankTransfer" -> "Bank Transfer pattern with amount-based routing";
            default -> "Pattern matching demonstration completed";
        };
    }

    /**
     * Get scenario description
     */
    private String getScenarioDescription(String scenario) {
        return switch (scenario.toUpperCase()) {
            case "HIGH_VALUE_INTERNATIONAL" -> "High-value international credit card transaction";
            case "HIGH_VALUE_DOMESTIC" -> "High-value domestic credit card transaction";
            case "PREMIUM_PAYPAL" -> "Premium customer PayPal processing";
            case "UNVERIFIED_PAYPAL" -> "Unverified PayPal account handling";
            case "LARGE_BANK_TRANSFER" -> "Large bank transfer requiring approval";
            case "INVALID_ROUTING" -> "Invalid routing number validation";
            default -> "Standard payment processing";
        };
    }

    // ============================================================================
    // REQUEST/RESPONSE RECORDS (Enhanced)
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