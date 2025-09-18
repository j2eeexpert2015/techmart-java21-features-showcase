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
 * Enhanced Payment Processing Controller with Rich Educational Metadata
 *
 * UPDATED: Now provides the same level of detailed educational metadata as ShoppingCartController
 * Shows controller → service method flow, Java 21 features used, and comprehensive educational info
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentProcessingController {

    private final PaymentProcessingService paymentService;

    public PaymentProcessingController(PaymentProcessingService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Enhanced payment processing endpoint with comprehensive educational metadata
     * MATCHES the detailed response format of shopping cart demo
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody PaymentRequest request) {

        // Create payment method from request
        PaymentMethod paymentMethod = createPaymentMethodFromRequest(request);

        // Create demo customer
        Customer customer = createDemoCustomer(request);

        // === CALL SERVICE METHOD (like shopping cart) ===
        PaymentProcessingResult result = paymentService.processPayment(
                paymentMethod, request.amount(), customer
        );

        // === BUILD COMPREHENSIVE RESPONSE WITH EDUCATIONAL METADATA ===
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

        // === EDUCATIONAL METADATA (LIKE SHOPPING CART) ===

        // Controller & Service method tracking
        response.put("controller_method", "PaymentProcessingController.processPayment");
        response.put("service_method", "PaymentProcessingService.processPayment");

        // Java 21 features used (like shopping cart's java21_methods_used)
        response.put("java21_methods_used", getJava21MethodsUsed(result));
        response.put("java21_features_used", List.of(
                "Pattern Matching for Switch",
                "Record Patterns",
                "Guard Conditions",
                "Sealed Interfaces",
                "Record Destructuring",
                "Exhaustive Matching"
        ));

        // Pattern matching details (like shopping cart's operation_description)
        response.put("pattern_matched", result.patternMatched());
        response.put("guard_condition", result.guardCondition());
        response.put("processing_action", result.processingAction());
        response.put("operation_description", getOperationDescription(result));

        // Educational context (like shopping cart's performance_benefit)
        response.put("business_rule_applied", getBusinessRuleDescription(result));
        response.put("pattern_matching_path", getPatternMatchingPath(result));
        response.put("record_components_extracted", getRecordComponentsCount(paymentMethod));

        // Java 21 feature classification
        response.put("java21_feature", "Pattern Matching for Switch");
        response.put("jep_reference", "JEP 441: Pattern Matching for switch");
        response.put("performance_benefit", "Type-safe pattern matching with automatic casting and exhaustive checking");

        return ResponseEntity.ok(response);
    }

    /**
     * Simple payment endpoint for basic demo (like shopping cart's simple endpoints)
     */
    @PostMapping("/simple")
    public ResponseEntity<Map<String, Object>> processSimplePayment(@RequestBody SimplePaymentRequest request) {

        // === SIMULATE PATTERN MATCHING LOGIC ===
        String result = switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "REQUIRES_VERIFICATION - High value credit card";
                } else {
                    yield "APPROVED - Credit card approved";
                }
            }
            case "paypal" -> "APPROVED - PayPal processed";
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "REQUIRES_APPROVAL - Large bank transfer";
                } else {
                    yield "APPROVED - Bank transfer approved";
                }
            }
            default -> "ERROR - Unknown payment method";
        };

        // === BUILD ENHANCED RESPONSE WITH EDUCATIONAL METADATA ===
        Map<String, Object> response = new LinkedHashMap<>();

        // Basic result data
        String[] parts = result.split(" - ");
        response.put("status", parts[0]);
        response.put("message", parts.length > 1 ? parts[1] : result);
        response.put("amount", request.amount());
        response.put("method", request.method());
        response.put("timestamp", LocalDateTime.now());

        // === COMPREHENSIVE EDUCATIONAL METADATA ===

        // Controller & Service method tracking (like shopping cart)
        response.put("controller_method", "PaymentProcessingController.processSimplePayment");
        response.put("service_method", "SimplePaymentService.processPayment (simulated)");

        // Java 21 methods used (like shopping cart's specific method names)
        response.put("java21_methods_used", List.of("switch-pattern-matching", "yield-expressions"));

        // Pattern matching details
        response.put("pattern_matched", getPatternMatchedForMethod(request.method()));
        response.put("guard_condition", getGuardConditionForRequest(request));
        response.put("processing_action", getProcessingActionForRequest(request));

        // Operation description (like shopping cart)
        response.put("operation_description", buildOperationDescription(request));

        // Java 21 feature classification
        response.put("java21_feature", "Pattern Matching for Switch");
        response.put("jep_reference", "JEP 441: Pattern Matching for switch");
        response.put("performance_benefit", "Cleaner code with exhaustive pattern matching and guard conditions");

        // Business rule applied
        response.put("business_rule_applied", getBusinessRuleDescription(request));

        // Pattern matching path (like shopping cart's flow description)
        response.put("pattern_matching_path", buildPatternMatchingPath(request));

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing statistics with educational metadata
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

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "PaymentProcessingController.getProcessingStats");
        response.put("service_method", "PaymentProcessingService.getProcessingStats");
        response.put("java21_features_used", List.of("Records", "Sealed Interfaces", "Pattern Matching Results"));
        response.put("operation_description", "Statistics aggregation from pattern matching decisions");

        return ResponseEntity.ok(response);
    }

    /**
     * Get processing history with educational metadata
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getProcessingHistory() {
        List<PaymentProcessingResult> history = paymentService.getProcessingHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("history", history);
        response.put("totalEntries", history.size());

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "PaymentProcessingController.getProcessingHistory");
        response.put("service_method", "PaymentProcessingService.getProcessingHistory");
        response.put("java21_features_used", List.of("Records", "Pattern Matching Results", "Immutable Data"));
        response.put("operation_description", "Historical view of pattern matching decisions");

        return ResponseEntity.ok(response);
    }

    /**
     * Clear processing history
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory() {
        paymentService.clearHistory();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("message", "Payment processing history cleared successfully");

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "PaymentProcessingController.clearHistory");
        response.put("service_method", "PaymentProcessingService.clearHistory");
        response.put("operation_description", "Demo reset - clear all pattern matching results");

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // HELPER METHODS FOR EDUCATIONAL METADATA (like shopping cart)
    // ============================================================================

    /**
     * Get Java 21 methods used (like shopping cart's java21_methods_used)
     */
    private List<String> getJava21MethodsUsed(PaymentProcessingResult result) {
        return List.of(
                "switch-pattern-matching",
                "record-destructuring",
                "guard-conditions",
                "sealed-interface-matching",
                "yield-expressions"
        );
    }

    /**
     * Get operation description (like shopping cart's operation_description)
     */
    private String getOperationDescription(PaymentProcessingResult result) {
        if (!"none".equals(result.guardCondition())) {
            return "Pattern matched with guard condition: " + result.guardCondition();
        } else {
            return "Standard pattern matching without guards";
        }
    }

    /**
     * Get business rule description (like shopping cart's business logic info)
     */
    private String getBusinessRuleDescription(PaymentProcessingResult result) {
        return switch (result.status()) {
            case APPROVED -> "Standard processing rules applied successfully";
            case REQUIRES_VERIFICATION -> "Security verification required by business rules";
            case REQUIRES_APPROVAL -> "Manager approval required by policy";
            case DECLINED -> "Transaction declined due to validation failure";
            default -> "Processing rules applied";
        };
    }

    /**
     * Get business rule description for simple requests
     */
    private String getBusinessRuleDescription(SimplePaymentRequest request) {
        return switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "High-value credit card transactions require additional verification for security";
                } else {
                    yield "Standard credit card processing rules applied";
                }
            }
            case "paypal" -> "PayPal transactions processed with standard validation";
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "Large bank transfers require manager approval per compliance policy";
                } else {
                    yield "Standard bank transfer processing rules applied";
                }
            }
            default -> "No specific business rules for unknown payment method";
        };
    }

    /**
     * Get pattern matching path for educational purposes
     */
    private String getPatternMatchingPath(PaymentProcessingResult result) {
        String pattern = result.patternMatched();
        String guard = result.guardCondition();

        if ("none".equals(guard)) {
            return pattern + " → Standard Path → " + result.processingAction();
        } else {
            return pattern + " → Guard: " + guard + " → " + result.processingAction();
        }
    }

    /**
     * Build pattern matching path for simple requests
     */
    private String buildPatternMatchingPath(SimplePaymentRequest request) {
        String pattern = getPatternMatchedForMethod(request.method());
        String guard = getGuardConditionForRequest(request);
        String action = getProcessingActionForRequest(request);

        if ("none".equals(guard)) {
            return String.format("%s → Standard Path → %s", pattern, action);
        } else {
            return String.format("%s → Guard: %s → %s", pattern, guard, action);
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
     * Get the pattern that was matched for the given payment method
     */
    private String getPatternMatchedForMethod(String method) {
        return switch (method) {
            case "creditcard" -> "CreditCard Pattern";
            case "paypal" -> "PayPal Pattern";
            case "bank" -> "BankTransfer Pattern";
            default -> "Unknown Pattern";
        };
    }

    /**
     * Determine which guard condition was evaluated for this request
     */
    private String getGuardConditionForRequest(SimplePaymentRequest request) {
        return switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "amount > $1,000";
                } else {
                    yield "amount <= $1,000";
                }
            }
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "amount >= $5,000";
                } else {
                    yield "amount < $5,000";
                }
            }
            default -> "none";
        };
    }

    /**
     * Get the processing action that was taken
     */
    private String getProcessingActionForRequest(SimplePaymentRequest request) {
        return switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "requireAdditionalVerification";
                } else {
                    yield "processStandardCreditCard";
                }
            }
            case "paypal" -> "processStandardPayPal";
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "requireManagerApproval";
                } else {
                    yield "processStandardBankTransfer";
                }
            }
            default -> "handleUnknownMethod";
        };
    }

    /**
     * Build a human-readable operation description
     */
    private String buildOperationDescription(SimplePaymentRequest request) {
        String method = getMethodDisplayName(request.method());
        String amount = "$" + request.amount().toPlainString();
        String guard = getGuardConditionForRequest(request);

        if (!"none".equals(guard)) {
            return String.format("%s payment (%s) with guard condition: %s", method, amount, guard);
        } else {
            return String.format("%s payment (%s) with standard processing", method, amount);
        }
    }

    /**
     * Get user-friendly display name for payment method
     */
    private String getMethodDisplayName(String method) {
        return switch (method) {
            case "creditcard" -> "Credit Card";
            case "paypal" -> "PayPal";
            case "bank" -> "Bank Transfer";
            default -> "Unknown Method";
        };
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

    /**
     * Simple request record for basic payment processing demo
     */
    public record SimplePaymentRequest(
            String method,
            BigDecimal amount
    ) {
        /**
         * Compact constructor with validation
         */
        public SimplePaymentRequest {
            if (method == null || method.isBlank()) {
                throw new IllegalArgumentException("Payment method cannot be null or empty");
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be positive");
            }
        }

        /**
         * Check if this is a high-value transaction
         */
        public boolean isHighValue() {
            return amount.compareTo(BigDecimal.valueOf(1000)) > 0;
        }

        /**
         * Check if this requires special approval
         */
        public boolean requiresApproval() {
            return "bank".equals(method) && amount.compareTo(BigDecimal.valueOf(5000)) >= 0;
        }
    }
}