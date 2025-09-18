package com.example.techmart.features.recordpatterns.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Enhanced Simple Payment Controller with Rich Educational Metadata
 *
 * UPDATED: Now provides the same level of detailed educational metadata as PaymentProcessingController
 * Shows controller → service method flow, Java 21 features used, and comprehensive educational info
 * INCLUDES: Server-side logging for backend flow tracking
 */
@RestController
@RequestMapping("/api/simple-payment")
public class SimplePaymentController {

    private static final Logger logger = LoggerFactory.getLogger(SimplePaymentController.class);

    /**
     * Enhanced simple payment processing endpoint with comprehensive educational metadata
     * MATCHES the detailed response format of PaymentProcessingController
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processSimplePayment(@RequestBody SimplePaymentRequest request) {

        // === CONTROLLER LOGGING ===
        logger.info("🔴 Controller Entry: SimplePaymentController.processSimplePayment");
        logger.info("📋 Request received: method={}, amount=${}", request.method(), request.amount());

        long startTime = System.currentTimeMillis();

        // === SIMULATE SERVICE LAYER LOGGING ===
        logger.info("🟣 Service Layer: Calling SimplePaymentService.processPayment");
        logger.info("🔥 Java 21 Feature: Starting PATTERN MATCHING FOR SWITCH");

        // === SIMULATE PATTERN MATCHING LOGIC ===
        String result = switch (request.method()) {
            case "creditcard" -> {
                logger.info("🎯 Pattern Matched: CreditCard case in switch expression");
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    logger.info("⚡ Guard Condition: amount > $1000 = TRUE");
                    logger.info("🔄 Processing Action: requireAdditionalVerification()");
                    yield "REQUIRES_VERIFICATION - High value credit card";
                } else {
                    logger.info("✅ Standard Path: amount <= $1000, standard processing");
                    logger.info("🔄 Processing Action: processStandardCreditCard()");
                    yield "APPROVED - Credit card approved";
                }
            }
            case "paypal" -> {
                logger.info("🎯 Pattern Matched: PayPal case in switch expression");
                logger.info("🔄 Processing Action: processStandardPayPal()");
                yield "APPROVED - PayPal processed";
            }
            case "bank" -> {
                logger.info("🎯 Pattern Matched: BankTransfer case in switch expression");
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    logger.info("⚡ Guard Condition: amount >= $5000 = TRUE");
                    logger.info("🔄 Processing Action: requireManagerApproval()");
                    yield "REQUIRES_APPROVAL - Large bank transfer";
                } else {
                    logger.info("✅ Standard Path: amount < $5000, standard processing");
                    logger.info("🔄 Processing Action: processStandardBankTransfer()");
                    yield "APPROVED - Bank transfer approved";
                }
            }
            default -> {
                logger.error("❌ Pattern Matching: Unknown payment method: {}", request.method());
                yield "ERROR - Unknown payment method";
            }
        };

        logger.info("🔚 Pattern Matching Complete: Exhaustive matching finished");

        long processingTime = System.currentTimeMillis() - startTime;
        logger.info("⏱️ Processing Time: {}ms", processingTime);

        // === BUILD COMPREHENSIVE RESPONSE WITH EDUCATIONAL METADATA ===
        Map<String, Object> response = new LinkedHashMap<>();

        // === BASIC RESULT DATA ===
        String[] parts = result.split(" - ");
        response.put("status", parts[0]);
        response.put("message", parts.length > 1 ? parts[1] : result);
        response.put("amount", request.amount());
        response.put("method", request.method());
        response.put("timestamp", LocalDateTime.now());
        response.put("successful", !parts[0].equals("ERROR"));
        response.put("requiresAdditionalAction", parts[0].equals("REQUIRES_VERIFICATION") || parts[0].equals("REQUIRES_APPROVAL"));

        // === EDUCATIONAL METADATA (LIKE PAYMENTPROCESSINGCONTROLLER) ===

        // Controller & Service method tracking
        response.put("controller_method", "SimplePaymentController.processSimplePayment");
        response.put("service_method", "SimplePaymentService.processPayment (simulated)");

        // Java 21 features used (like PaymentProcessingController's java21_methods_used)
        response.put("java21_methods_used", List.of("switch-pattern-matching", "yield-expressions", "guard-conditions"));
        response.put("java21_features_used", List.of(
                "Pattern Matching for Switch",
                "Yield Expressions",
                "Guard Conditions",
                "String Pattern Matching",
                "Exhaustive Matching"
        ));

        // Pattern matching details (like PaymentProcessingController's operation_description)
        response.put("pattern_matched", getPatternMatchedForMethod(request.method()));
        response.put("guard_condition", getGuardConditionForRequest(request));
        response.put("processing_action", getProcessingActionForRequest(request));
        response.put("operation_description", buildOperationDescription(request));

        // Educational context (like PaymentProcessingController's performance_benefit)
        response.put("business_rule_applied", getBusinessRuleDescription(request));
        response.put("pattern_matching_path", buildPatternMatchingPath(request));
        response.put("record_components_extracted", getRecordComponentsCount(request));

        // Java 21 feature classification
        response.put("java21_feature", "Pattern Matching for Switch");
        response.put("jep_reference", "JEP 441: Pattern Matching for switch");
        response.put("performance_benefit", "Cleaner code with exhaustive pattern matching and guard conditions");

        // Processing flow info (like PaymentProcessingController)
        response.put("processing_flow", getProcessingFlow(request));
        response.put("decision_tree", getDecisionTree(request));

        // === FINAL CONTROLLER LOGGING ===
        logger.info("✅ Controller Response: Returning educational metadata with {} fields", response.size());
        logger.info("📤 Final Status: {}", response.get("status"));

        return ResponseEntity.ok(response);
    }

    /**
     * Get multiple test amounts endpoint with educational metadata
     */
    @PostMapping("/test-amounts")
    public ResponseEntity<Map<String, Object>> testMultipleAmounts(@RequestBody TestAmountsRequest request) {

        logger.info("🔴 Controller Entry: SimplePaymentController.testMultipleAmounts");
        logger.info("📋 Request: method={}, amounts={}", request.method(), request.amounts());
        logger.info("🟣 Service Layer: Calling SimplePaymentService.testMultipleAmounts");

        Map<String, Object> response = new LinkedHashMap<>();

        // Process each amount
        Map<String, Object> results = new LinkedHashMap<>();
        for (BigDecimal amount : request.amounts()) {
            logger.info("🔄 Processing amount: ${}", amount);
            SimplePaymentRequest testRequest = new SimplePaymentRequest(request.method(), amount);
            Map<String, Object> testResult = processAmountTest(testRequest);
            results.put("$" + amount.toPlainString(), testResult);
        }

        response.put("method", request.method());
        response.put("results", results);
        response.put("total_tests", request.amounts().size());

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "SimplePaymentController.testMultipleAmounts");
        response.put("service_method", "SimplePaymentService.testMultipleAmounts (simulated)");
        response.put("java21_features_used", List.of("Pattern Matching", "Guard Conditions", "Yield Expressions"));
        response.put("operation_description", "Batch testing pattern matching with different guard condition triggers");
        response.put("java21_feature", "Pattern Matching for Switch with Guard Conditions");

        logger.info("✅ Controller Response: Tested {} amounts with pattern matching", request.amounts().size());
        return ResponseEntity.ok(response);
    }

    /**
     * Get payment method comparison with educational metadata
     */
    @GetMapping("/compare-methods")
    public ResponseEntity<Map<String, Object>> comparePaymentMethods(@RequestParam BigDecimal amount) {

        logger.info("🔴 Controller Entry: SimplePaymentController.comparePaymentMethods");
        logger.info("📋 Request: amount=${}", amount);
        logger.info("🟣 Service Layer: Calling SimplePaymentService.comparePaymentMethods");

        Map<String, Object> response = new LinkedHashMap<>();

        // Test all payment methods with the same amount
        String[] methods = {"creditcard", "paypal", "bank"};
        Map<String, Object> comparisons = new LinkedHashMap<>();

        for (String method : methods) {
            logger.info("🔄 Testing method: {}", method);
            SimplePaymentRequest testRequest = new SimplePaymentRequest(method, amount);
            Map<String, Object> methodResult = processAmountTest(testRequest);
            comparisons.put(method, methodResult);
        }

        response.put("amount", amount);
        response.put("comparisons", comparisons);
        response.put("methods_tested", methods.length);

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "SimplePaymentController.comparePaymentMethods");
        response.put("service_method", "SimplePaymentService.comparePaymentMethods (simulated)");
        response.put("java21_features_used", List.of("Pattern Matching", "String Patterns", "Guard Conditions"));
        response.put("operation_description", "Comparing pattern matching behavior across different payment methods");
        response.put("java21_feature", "Exhaustive Pattern Matching");
        response.put("pattern_matching_path", "switch(method) → All payment method patterns tested");

        logger.info("✅ Controller Response: Compared {} payment methods", methods.length);
        return ResponseEntity.ok(response);
    }

    /**
     * Get processing statistics with educational metadata
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProcessingStats() {

        logger.info("🔴 Controller Entry: SimplePaymentController.getProcessingStats");
        logger.info("🟣 Service Layer: Calling SimplePaymentService.getProcessingStats");

        Map<String, Object> response = new LinkedHashMap<>();

        // Simulated stats
        response.put("totalProcessed", 1247);
        response.put("successfulPayments", 1156);
        response.put("successRate", "92.7%");
        response.put("requiresVerification", 67);
        response.put("requiresApproval", 24);
        response.put("erroredPayments", 91);
        response.put("errorRate", "7.3%");
        response.put("averageProcessingTime", "1.2 seconds");

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "SimplePaymentController.getProcessingStats");
        response.put("service_method", "SimplePaymentService.getProcessingStats (simulated)");
        response.put("java21_features_used", List.of("Pattern Matching Statistics", "Guard Condition Analysis"));
        response.put("operation_description", "Statistics aggregation from pattern matching decisions");
        response.put("java21_feature", "Pattern Matching Analytics");

        logger.info("✅ Controller Response: Statistics generated successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Clear processing history
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory() {

        logger.info("🔴 Controller Entry: SimplePaymentController.clearHistory");
        logger.info("🟣 Service Layer: Calling SimplePaymentService.clearHistory");
        logger.info("🧹 Operation: Clearing demo history and resetting state");

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "cleared");
        response.put("message", "Simple payment processing history cleared successfully");
        response.put("cleared_at", LocalDateTime.now());

        // === EDUCATIONAL METADATA ===
        response.put("controller_method", "SimplePaymentController.clearHistory");
        response.put("service_method", "SimplePaymentService.clearHistory (simulated)");
        response.put("operation_description", "Demo reset - clear all pattern matching results");
        response.put("java21_feature", "Administrative Operations");

        logger.info("✅ Controller Response: History cleared successfully");
        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // HELPER METHODS FOR EDUCATIONAL METADATA (like PaymentProcessingController)
    // ============================================================================

    /**
     * Process a single amount test with full educational metadata
     */
    private Map<String, Object> processAmountTest(SimplePaymentRequest request) {
        Map<String, Object> result = new LinkedHashMap<>();

        // Determine result
        String processResult = switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "REQUIRES_VERIFICATION";
                } else {
                    yield "APPROVED";
                }
            }
            case "paypal" -> "APPROVED";
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "REQUIRES_APPROVAL";
                } else {
                    yield "APPROVED";
                }
            }
            default -> "ERROR";
        };

        result.put("status", processResult);
        result.put("pattern_matched", getPatternMatchedForMethod(request.method()));
        result.put("guard_condition", getGuardConditionForRequest(request));
        result.put("processing_action", getProcessingActionForRequest(request));

        return result;
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
     * Get number of record components extracted (simulated for string patterns)
     */
    private int getRecordComponentsCount(SimplePaymentRequest request) {
        // For simple string patterns, simulate component extraction
        return switch (request.method()) {
            case "creditcard" -> 8; // number, type, cvv, month, year, name, international, createdAt
            case "paypal" -> 5;     // email, accountId, isVerified, saveForFuture, createdAt
            case "bank" -> 6;       // account, routing, bankName, accountType, holderName, createdAt
            default -> 0;
        };
    }

    /**
     * Get processing flow for educational purposes
     */
    private String getProcessingFlow(SimplePaymentRequest request) {
        return String.format("Input → Pattern Match (%s) → Guard Evaluation → Processing Action → Result",
                getPatternMatchedForMethod(request.method()));
    }

    /**
     * Get decision tree visualization
     */
    private String getDecisionTree(SimplePaymentRequest request) {
        String method = request.method();
        BigDecimal amount = request.amount();

        return switch (method) {
            case "creditcard" -> {
                if (amount.compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "creditcard → amount > $1000 → VERIFICATION_REQUIRED";
                } else {
                    yield "creditcard → amount <= $1000 → APPROVED";
                }
            }
            case "paypal" -> "paypal → no guards → APPROVED";
            case "bank" -> {
                if (amount.compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "bank → amount >= $5000 → APPROVAL_REQUIRED";
                } else {
                    yield "bank → amount < $5000 → APPROVED";
                }
            }
            default -> "unknown → ERROR";
        };
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

    // ============================================================================
    // REQUEST/RESPONSE RECORDS
    // ============================================================================

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

    /**
     * Request record for testing multiple amounts
     */
    public record TestAmountsRequest(
            String method,
            List<BigDecimal> amounts
    ) {
        /**
         * Compact constructor with validation
         */
        public TestAmountsRequest {
            if (method == null || method.isBlank()) {
                throw new IllegalArgumentException("Payment method cannot be null or empty");
            }
            if (amounts == null || amounts.isEmpty()) {
                throw new IllegalArgumentException("At least one amount must be provided");
            }
            // Validate all amounts are positive
            for (BigDecimal amount : amounts) {
                if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("All amounts must be positive");
                }
            }
        }

        /**
         * Get count of high-value amounts
         */
        public long getHighValueCount() {
            return amounts.stream()
                    .filter(amount -> amount.compareTo(BigDecimal.valueOf(1000)) > 0)
                    .count();
        }

        /**
         * Get maximum amount
         */
        public BigDecimal getMaxAmount() {
            return amounts.stream()
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);
        }
    }
}