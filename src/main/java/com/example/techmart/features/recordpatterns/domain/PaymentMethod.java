package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;

/**
 * Payment Method - Sealed Interface for Java 21 Pattern Matching Demo
 *
 * This sealed interface demonstrates Java 21's enhanced pattern matching capabilities.
 * The 'sealed' keyword restricts which classes can implement this interface,
 * enabling exhaustive pattern matching without default cases.
 *
 * Java 21 Benefits:
 * - Compiler guarantees all payment types are handled in switch expressions
 * - No default case needed - sealed interface ensures exhaustiveness
 * - Type-safe pattern matching with automatic casting
 * - Clear, maintainable code for business logic
 */
public sealed interface PaymentMethod
        permits CreditCard, PayPal, BankTransfer {

    // Basic contract that all payment methods must implement
    String getType();

    // Simple validation - just enough for demo purposes
    boolean isValid();

    // Basic processing fee calculation for business logic demonstration
    BigDecimal getProcessingFee(BigDecimal amount);
}