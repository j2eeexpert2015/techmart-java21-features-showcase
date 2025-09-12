package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Payment Processing Result - Immutable record capturing payment processing outcome
 *
 * This record demonstrates Java 21 features while representing the result of
 * pattern matching-based payment processing logic.
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
        LocalDateTime processedAt,
        ProcessingMetadata metadata
) {

    /**
     * Compact constructor with validation and defaults
     */
    public PaymentProcessingResult {
        if (transactionId == null) {
            transactionId = UUID.randomUUID();
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        if (processingFee == null) {
            processingFee = BigDecimal.ZERO;
        }

        if (status == null) {
            status = ProcessingStatus.PENDING;
        }

        if (validationMessages == null) {
            validationMessages = List.of();
        } else {
            validationMessages = List.copyOf(validationMessages);
        }

        if (processedAt == null) {
            processedAt = LocalDateTime.now();
        }

        if (metadata == null) {
            metadata = new ProcessingMetadata(null, null, null, List.of());
        }
    }

    /**
     * Processing Status Enum
     */
    public enum ProcessingStatus {
        PENDING("Payment is being processed"),
        APPROVED("Payment approved and processed successfully"),
        REQUIRES_VERIFICATION("Additional verification required"),
        REQUIRES_APPROVAL("Manager approval required"),
        DECLINED("Payment declined"),
        FAILED("Payment processing failed"),
        EXPIRED("Payment method expired");

        private final String description;

        ProcessingStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Processing Metadata - Additional information about the processing decision
     */
    public record ProcessingMetadata(
            String customerTier,
            String riskLevel,
            String processingRoute,
            List<String> appliedRules
    ) {
        public ProcessingMetadata {
            if (appliedRules == null) {
                appliedRules = List.of();
            } else {
                appliedRules = List.copyOf(appliedRules);
            }
        }
    }

    // Convenience methods for common checks

    /**
     * Check if payment was successful
     */
    public boolean isSuccessful() {
        return status == ProcessingStatus.APPROVED;
    }

    /**
     * Check if payment requires additional action
     */
    public boolean requiresAdditionalAction() {
        return status == ProcessingStatus.REQUIRES_VERIFICATION ||
                status == ProcessingStatus.REQUIRES_APPROVAL;
    }

    /**
     * Check if payment failed
     */
    public boolean hasFailed() {
        return status == ProcessingStatus.DECLINED ||
                status == ProcessingStatus.FAILED ||
                status == ProcessingStatus.EXPIRED;
    }

    /**
     * Get total amount including processing fee
     */
    public BigDecimal getTotalAmount() {
        return amount.add(processingFee);
    }

    /**
     * Get user-friendly status message
     */
    public String getStatusMessage() {
        return status.getDescription();
    }

    /**
     * Check if this is a high-value transaction
     */
    public boolean isHighValue() {
        return amount.compareTo(BigDecimal.valueOf(1000)) >= 0;
    }

    /**
     * Check if international processing was applied
     */
    public boolean hasInternationalProcessing() {
        return processingAction != null &&
                processingAction.contains("international");
    }

    /**
     * Factory method for successful payment
     */
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
                "none",
                patternMatched,
                List.of("Payment processed successfully"),
                "Immediate",
                LocalDateTime.now(),
                new ProcessingMetadata("STANDARD", "LOW", "STANDARD", List.of("standard_processing"))
        );
    }

    /**
     * Factory method for payment requiring verification
     */
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
                LocalDateTime.now(),
                new ProcessingMetadata("STANDARD", "HIGH", "MANUAL_REVIEW",
                        List.of("high_value_check", "international_check"))
        );
    }

    /**
     * Factory method for payment requiring approval
     */
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
                LocalDateTime.now(),
                new ProcessingMetadata("BUSINESS", "MEDIUM", "MANAGER_APPROVAL",
                        List.of("large_amount_check", "bank_transfer_verification"))
        );
    }

    /**
     * Factory method for declined payment
     */
    public static PaymentProcessingResult declined(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String reason,
            String patternMatched) {

        return new PaymentProcessingResult(
                UUID.randomUUID(),
                paymentMethod,
                amount,
                BigDecimal.ZERO,
                ProcessingStatus.DECLINED,
                "declinePayment",
                "validation_failed",
                patternMatched,
                List.of(reason),
                "N/A",
                LocalDateTime.now(),
                new ProcessingMetadata("UNKNOWN", "HIGH", "DECLINED", List.of("validation_failure"))
        );
    }

    /**
     * Factory method for expedited processing (premium customers)
     */
    public static PaymentProcessingResult expedited(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String patternMatched,
            String customerTier,
            BigDecimal discount) {

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
                LocalDateTime.now(),
                new ProcessingMetadata(customerTier, "LOW", "EXPEDITED",
                        List.of("premium_customer", "expedited_processing"))
        );
    }
}