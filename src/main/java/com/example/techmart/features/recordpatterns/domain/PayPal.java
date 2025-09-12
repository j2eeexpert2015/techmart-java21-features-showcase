package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PayPal Payment Method Record
 * Supports PayPal account payments with expedited processing for premium customers
 *
 * This record implements the PaymentMethod sealed interface and demonstrates
 * Java 21 record patterns with email validation and account verification logic.
 */
public record PayPal(
        String email,
        String paypalAccountId,
        boolean isVerified,
        boolean saveForFuturePayments,
        LocalDateTime createdAt
) implements PaymentMethod {

    /**
     * Compact constructor with validation
     */
    public PayPal {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("PayPal email cannot be null or blank");
        }

        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid PayPal email format");
        }

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
        return email != null && isValidEmail(email) && isVerified;
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // PayPal processing fee: 2.9% + $0.30 for domestic
        BigDecimal percentageFee = amount.multiply(BigDecimal.valueOf(0.029));
        BigDecimal fixedFee = BigDecimal.valueOf(0.30);

        return percentageFee.add(fixedFee);
    }

    /**
     * Get masked email for display (e.g., "j***@example.com")
     */
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

    private static boolean isValidEmail(String email) {
        return email != null && email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}