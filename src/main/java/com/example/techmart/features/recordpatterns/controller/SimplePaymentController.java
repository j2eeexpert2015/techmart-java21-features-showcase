package com.example.techmart.features.recordpatterns.controller;

import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Enhanced Simple Payment Controller - Clear Method Tracking
 *
 * UPDATED: Provides detailed service method tracking and Java 21 method documentation
 *
 * This controller demonstrates Java 21 pattern matching through a simple interface
 * while providing comprehensive educational metadata about which methods are used.
 */
@RestController
@RequestMapping("/api/simple")
public class SimplePaymentController {

    /**
     * Enhanced payment processing endpoint with detailed educational metadata
     *
     * This method demonstrates Java 21 pattern matching in the simplest way possible
     * while providing comprehensive information about which Java 21 features are used.
     */
    @PostMapping("/payment")
    public Map<String, Object> processSimplePayment(@RequestBody SimplePaymentRequest request) {

        System.out.println("🚀 Processing payment: " + request.method() + " for $" + request.amount());

        // === JAVA 21 PATTERN MATCHING DEMONSTRATION ===
        // This switch expression shows Java 21's enhanced pattern matching capabilities
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

        // === BASIC RESULT DATA ===
        String[] parts = result.split(" - ");
        response.put("status", parts[0]);
        response.put("message", parts.length > 1 ? parts[1] : result);
        response.put("amount", request.amount());
        response.put("method", request.method());
        response.put("timestamp", LocalDateTime.now());

        // === DETAILED EDUCATIONAL METADATA ===
        addEducationalMetadata(response, request);

        return response;
    }

    /**
     * Add comprehensive educational metadata about Java 21 features used
     */
    private void addEducationalMetadata(Map<String, Object> response, SimplePaymentRequest request) {

        // === CONTROLLER LAYER ===
        response.put("controller_method", "SimplePaymentController.processSimplePayment");

        // === SERVICE LAYER (simulated in controller for simplicity) ===
        response.put("service_method", "SimplePaymentService.processPayment (simulated)");

        // === JAVA 21 METHODS ACTUALLY USED ===
        response.put("java21_methods_used", List.of("switch-pattern-matching", "yield-expressions"));

        // === PATTERN MATCHING DETAILS ===
        response.put("pattern_matched", getPatternMatchedForMethod(request.method()));
        response.put("guard_condition", getGuardConditionForRequest(request));
        response.put("processing_action", getProcessingActionForRequest(request));

        // === OPERATION DESCRIPTION ===
        response.put("operation_description", buildOperationDescription(request));

        // === JAVA 21 FEATURE CLASSIFICATION ===
        response.put("java21_feature", "Pattern Matching for Switch");
        response.put("jep_reference", "JEP 441: Pattern Matching for switch");

        // === PERFORMANCE BENEFIT ===
        response.put("performance_benefit", "Cleaner code with exhaustive pattern matching and guard conditions");

        // === BUSINESS RULE APPLIED ===
        response.put("business_rule_applied", getBusinessRuleDescription(request));

        // === PATTERN MATCHING PATH ===
        response.put("pattern_matching_path", buildPatternMatchingPath(request));
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
     * Get business rule description for this payment
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
     * Build pattern matching path for educational purposes
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
     * Simple request record for payment processing
     *
     * This record demonstrates Java 21 record capabilities:
     * - Automatic constructor, equals, hashCode, toString
     * - Clean data transfer object
     * - Validation in compact constructor
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