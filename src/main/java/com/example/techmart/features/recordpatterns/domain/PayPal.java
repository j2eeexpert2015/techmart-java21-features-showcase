package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PayPal Payment Method Record
 *
 * Demonstrates Java 21 record patterns with customer tier-based processing.
 * This record shows how pattern matching can incorporate business rules
 * through guard conditions.
 *
 * Java 21 Features Demonstrated:
 * - Record pattern: case PayPal(var email, var accountId, var isVerified) -> ...
 * - Guard conditions: when customer.isPremium() -> expedited processing
 * - Clean business logic without complex inheritance hierarchies
 */
public record PayPal(
        String email,
        String paypalAccountId,
        boolean isVerified,
        boolean saveForFuturePayments,
        LocalDateTime createdAt
) implements PaymentMethod {

    // Compact constructor with validation
    public PayPal {
        // Basic email validation for demo
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("PayPal email cannot be empty");
        }

        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Set creation time if not provided
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Override
    public String getType() {
        return "PayPal";
    }

    @Override
    public boolean isValid() {
        // PayPal requires verified account for processing
        return email != null &&
                isValidEmail(email) &&
                isVerified;
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // PayPal standard fee: 2.9% + $0.30
        BigDecimal percentageFee = amount.multiply(BigDecimal.valueOf(0.029));
        BigDecimal fixedFee = BigDecimal.valueOf(0.30);
        return percentageFee.add(fixedFee);
    }

    // Helper method: Get masked email for display (privacy protection)
    public String getMaskedEmail() {
        if (email == null || email.length() < 3) {
            return "***@***.***";
        }

        int atIndex = email.indexOf('@');
        if (atIndex > 0) {
            String username = email.substring(0, atIndex);
            String domain = email.substring(atIndex);

            if (username.length() <= 2) {
                return username + "***" + domain;
            } else {
                return username.charAt(0) + "***" + domain;
            }
        }

        return "***@***.***";
    }

    // Helper method: Simple email validation for demo
    private static boolean isValidEmail(String email) {
        // Basic email pattern for demo purposes
        return email != null &&
                email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}