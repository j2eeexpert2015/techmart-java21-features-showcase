package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;

/**
 * Payment Processing Statistics - Record for demo dashboard metrics
 *
 * This record aggregates statistics from payment processing operations,
 * demonstrating Java 21 records with computed properties and business logic.
 * Used by the payment processing service to provide dashboard metrics.
 */
public record PaymentProcessingStats(
        long totalProcessed,
        long successfulPayments,
        long requiresVerification,
        long requiresApproval,
        long declined,
        BigDecimal totalAmount
) {

    /**
     * Calculate success rate as a percentage
     * @return Success rate (0.0 - 100.0)
     */
    public double getSuccessRate() {
        return totalProcessed > 0 ? (double) successfulPayments / totalProcessed * 100.0 : 0.0;
    }

    /**
     * Calculate decline rate as a percentage
     * @return Decline rate (0.0 - 100.0)
     */
    public double getDeclineRate() {
        return totalProcessed > 0 ? (double) declined / totalProcessed * 100.0 : 0.0;
    }

    /**
     * Calculate verification rate as a percentage
     * @return Verification rate (0.0 - 100.0)
     */
    public double getVerificationRate() {
        return totalProcessed > 0 ? (double) requiresVerification / totalProcessed * 100.0 : 0.0;
    }

    /**
     * Calculate approval rate as a percentage
     * @return Approval rate (0.0 - 100.0)
     */
    public double getApprovalRate() {
        return totalProcessed > 0 ? (double) requiresApproval / totalProcessed * 100.0 : 0.0;
    }

    /**
     * Get average transaction amount
     * @return Average amount per transaction
     */
    public BigDecimal getAverageTransactionAmount() {
        if (totalProcessed == 0) {
            return BigDecimal.ZERO;
        }

        return totalAmount.divide(BigDecimal.valueOf(totalProcessed), 2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Check if processing volume is high (> 100 transactions)
     * @return true if high volume
     */
    public boolean isHighVolume() {
        return totalProcessed > 100;
    }

    /**
     * Check if success rate is good (> 90%)
     * @return true if good success rate
     */
    public boolean hasGoodSuccessRate() {
        return getSuccessRate() > 90.0;
    }

    /**
     * Get processing efficiency score (0-100)
     * Based on success rate and low decline rate
     * @return Efficiency score
     */
    public double getEfficiencyScore() {
        double successWeight = getSuccessRate() * 0.7;  // 70% weight on success
        double declineWeight = (100.0 - getDeclineRate()) * 0.3;  // 30% weight on low declines

        return Math.min(100.0, successWeight + declineWeight);
    }

    /**
     * Factory method for empty stats
     * @return Empty statistics record
     */
    public static PaymentProcessingStats empty() {
        return new PaymentProcessingStats(0, 0, 0, 0, 0, BigDecimal.ZERO);
    }

    /**
     * Factory method for single successful payment
     * @param amount Payment amount
     * @return Stats with one successful payment
     */
    public static PaymentProcessingStats singleSuccess(BigDecimal amount) {
        return new PaymentProcessingStats(1, 1, 0, 0, 0, amount);
    }

    /**
     * Combine two statistics records
     * @param other Other stats to combine with
     * @return Combined statistics
     */
    public PaymentProcessingStats combine(PaymentProcessingStats other) {
        return new PaymentProcessingStats(
                this.totalProcessed + other.totalProcessed,
                this.successfulPayments + other.successfulPayments,
                this.requiresVerification + other.requiresVerification,
                this.requiresApproval + other.requiresApproval,
                this.declined + other.declined,
                this.totalAmount.add(other.totalAmount)
        );
    }

    /**
     * Get formatted summary string for logging/display
     * @return Human-readable summary
     */
    public String getSummary() {
        return String.format(
                "Processed: %d, Success: %.1f%%, Declined: %.1f%%, Total: $%.2f",
                totalProcessed,
                getSuccessRate(),
                getDeclineRate(),
                totalAmount
        );
    }
}