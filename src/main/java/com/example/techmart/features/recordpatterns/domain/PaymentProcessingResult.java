package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Payment Processing Result - Simple Record for Demo Results
 *
 * This record captures the outcome of Java 21 pattern matching-based payment processing.
 * It's designed to be simple but complete enough to demonstrate the educational value
 * of pattern matching decisions.
 *
 * Java 21 Features Demonstrated:
 * - Record with validation in compact constructor
 * - Factory methods for common result types
 * - Immutable result objects
 * - Clear API for different processing outcomes
 */
public record PaymentProcessingResult(
        UUID transactionId,
        PaymentMethod paymentMethod,
        BigDecimal amount,
        BigDecimal processingFee,
        ProcessingStatus status,
        String processingAction,
        String guardCondition,
        String patternMatched,
        List<String> validationMessages,
        String processingTimeEstimate,
        LocalDateTime processedAt
) {

    // Processing status enum for clear status tracking
    public enum ProcessingStatus {
        PENDING("Payment is being processed"),
        APPROVED("Payment approved and processed successfully"),
        REQUIRES_VERIFICATION("Additional verification required"),
        REQUIRES_APPROVAL("Manager approval required"),
        DECLINED("Payment declined"),
        FAILED("Payment processing failed");

        private final String description;

        ProcessingStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Compact constructor with validation and defaults
    public PaymentProcessingResult {
        // Generate transaction ID if not provided
        if (transactionId == null) {
            transactionId = UUID.randomUUID();
        }

        // Validate required fields
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        // Default processing fee if not specified
        if (processingFee == null) {
            processingFee = BigDecimal.ZERO;
        }

        // Default status if not specified
        if (status == null) {
            status = ProcessingStatus.PENDING;
        }

        // Ensure validation messages is never null
        if (validationMessages == null) {
            validationMessages = List.of();
        } else {
            validationMessages = List.copyOf(validationMessages); // Make immutable
        }

        // Set processing time if not provided
        if (processedAt == null) {
            processedAt = LocalDateTime.now();
        }
    }

    // Convenience methods for checking result status

    public boolean isSuccessful() {
        return status == ProcessingStatus.APPROVED;
    }

    public boolean requiresAdditionalAction() {
        return status == ProcessingStatus.REQUIRES_VERIFICATION ||
                status == ProcessingStatus.REQUIRES_APPROVAL;
    }

    public boolean hasFailed() {
        return status == ProcessingStatus.DECLINED ||
                status == ProcessingStatus.FAILED;
    }

    public BigDecimal getTotalAmount() {
        return amount.add(processingFee);
    }

    public String getStatusMessage() {
        return status.getDescription();
    }

    // Factory methods for common result types - makes creating results easier

    public static PaymentProcessingResult success(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String patternMatched,
            String processingAction) {

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                paymentMethod.getProcessingFee(amount),
                ProcessingStatus.APPROVED,
                processingAction,
                "none", // No guard condition triggered
                patternMatched,
                List.of("Payment processed successfully"),
                "Immediate",
                LocalDateTime.now()
        );
    }

    public static PaymentProcessingResult requiresVerification(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String guardCondition,
            String patternMatched,
            String reason) {

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                paymentMethod.getProcessingFee(amount),
                ProcessingStatus.REQUIRES_VERIFICATION,
                "requireAdditionalVerification",
                guardCondition,
                patternMatched,
                List.of(reason),
                "24-48 hours after verification",
                LocalDateTime.now()
        );
    }

    public static PaymentProcessingResult requiresApproval(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String guardCondition,
            String patternMatched,
            String reason) {

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                paymentMethod.getProcessingFee(amount),
                ProcessingStatus.REQUIRES_APPROVAL,
                "requireManagerApproval",
                guardCondition,
                patternMatched,
                List.of(reason),
                "5-7 business days",
                LocalDateTime.now()
        );
    }

    public static PaymentProcessingResult declined(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String reason,
            String patternMatched) {

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                BigDecimal.ZERO, // No processing fee for declined payments
                ProcessingStatus.DECLINED,
                "declinePayment",
                "validation_failed",
                patternMatched,
                List.of(reason),
                "N/A",
                LocalDateTime.now()
        );
    }

    public static PaymentProcessingResult expedited(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String patternMatched,
            String customerTier,
            BigDecimal discount) {

        // Apply discount to processing fee
        BigDecimal adjustedFee = paymentMethod.getProcessingFee(amount).subtract(discount);
        if (adjustedFee.compareTo(BigDecimal.ZERO) < 0) {
            adjustedFee = BigDecimal.ZERO;
        }

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                adjustedFee,
                ProcessingStatus.APPROVED,
                "processExpedited",
                "isPremiumCustomer",
                patternMatched,
                List.of("Expedited processing applied for " + customerTier + " customer"),
                "Immediate",
                LocalDateTime.now()
        );
    }
}