package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;

/**
 * TechMart Payment Method - Sealed Interface for Java 21 Pattern Matching Demo
 *
 * This sealed interface demonstrates Java 21's pattern matching capabilities with a realistic
 * payment processing hierarchy. Each implementation represents a different payment method
 * with its own validation rules and processing requirements.
 *
 * Business Rules Demonstrated:
 * - Credit Card: International + high value requires additional verification
 * - PayPal: Premium customers get expedited processing
 * - Bank Transfer: Large amounts require manager approval
 */
public sealed interface PaymentMethod
        permits CreditCard, PayPal, BankTransfer {

    /**
     * Get the payment method type for logging and analytics
     */
    String getType();

    /**
     * Validate payment method details
     * @return true if payment method is valid for processing
     */
    boolean isValid();

    /**
     * Get processing fee for this payment method
     * @param amount Transaction amount
     * @return Processing fee amount
     */
    BigDecimal getProcessingFee(BigDecimal amount);
}