package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Credit Card Payment Method Record
 *
 * This record demonstrates Java 21's record pattern matching capabilities.
 * Records provide automatic implementation of equals, hashCode, toString,
 * and enable pattern matching with destructuring.
 *
 * Java 21 Features Demonstrated:
 * - Record pattern matching: case CreditCard(var number, var type, var international) -> ...
 * - Automatic destructuring of record components in switch expressions
 * - Compact constructor for validation
 * - Immutable data with clean syntax
 */
public record CreditCard(
        String cardNumber,
        String cardType,
        String cvv,
        String expiryMonth,
        String expiryYear,
        String cardholderName,
        boolean isInternational,
        LocalDateTime createdAt
) implements PaymentMethod {

    // Compact constructor - validates input and provides defaults
    // This runs before the record's automatic constructor
    public CreditCard {
        // Basic validation for demo purposes
        if (cardNumber == null || cardNumber.isBlank()) {
            throw new IllegalArgumentException("Card number cannot be empty");
        }

        // Remove spaces from card number for processing
        cardNumber = cardNumber.replaceAll("\\s+", "");

        // Auto-detect card type if not provided (simplified logic for demo)
        if (cardType == null || cardType.isBlank()) {
            cardType = detectCardType(cardNumber);
        }

        // Set creation time if not provided
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Override
    public String getType() {
        return "CreditCard";
    }

    @Override
    public boolean isValid() {
        // Simplified validation for demo - just check basic requirements
        return cardNumber != null &&
                cardNumber.length() >= 13 &&
                cardNumber.length() <= 19 &&
                cvv != null &&
                cvv.matches("\\d{3,4}") &&
                isValidExpiryDate();
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // Basic fee calculation for demo
        // Standard credit card fee: 2.9% + $0.30
        BigDecimal percentageFee = amount.multiply(BigDecimal.valueOf(0.029));
        BigDecimal fixedFee = BigDecimal.valueOf(0.30);

        // International cards have additional 1.5% fee (for guard condition demo)
        if (isInternational) {
            BigDecimal internationalFee = amount.multiply(BigDecimal.valueOf(0.015));
            return percentageFee.add(fixedFee).add(internationalFee);
        }

        return percentageFee.add(fixedFee);
    }

    // Helper method: Get masked card number for display (security best practice)
    public String getMaskedCardNumber() {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        return "**** **** **** " + lastFour;
    }

    // Helper method: Simple card type detection for demo
    private static String detectCardType(String cardNumber) {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5") || cardNumber.startsWith("2")) return "MASTERCARD";
        if (cardNumber.startsWith("3")) return "AMEX";
        if (cardNumber.startsWith("6")) return "DISCOVER";
        return "UNKNOWN";
    }

    // Helper method: Basic expiry date validation
    private boolean isValidExpiryDate() {
        try {
            int expMonth = Integer.parseInt(expiryMonth);
            int expYear = Integer.parseInt(expiryYear);

            // Basic range checks for demo
            return expMonth >= 1 && expMonth <= 12 && expYear >= 2024;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}