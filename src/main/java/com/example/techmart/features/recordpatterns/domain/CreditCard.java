package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Credit Card Payment Method Record
 * Supports Visa, MasterCard, American Express, etc.
 *
 * This record implements the PaymentMethod sealed interface and demonstrates
 * Java 21 record patterns with complex business validation logic.
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

    /**
     * Compact constructor with validation and normalization
     */
    public CreditCard {
        if (cardNumber == null || cardNumber.isBlank()) {
            throw new IllegalArgumentException("Card number cannot be null or blank");
        }

        // Normalize card number (remove spaces)
        cardNumber = cardNumber.replaceAll("\\s+", "");

        if (cardType == null || cardType.isBlank()) {
            // Auto-detect card type from number
            cardType = detectCardType(cardNumber);
        }

        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            throw new IllegalArgumentException("CVV must be 3 or 4 digits");
        }

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
        return isValidCardNumber(cardNumber) &&
                isValidExpiryDate(expiryMonth, expiryYear) &&
                cvv != null && cvv.matches("\\d{3,4}");
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // Credit card processing fee: 2.9% + $0.30
        BigDecimal percentageFee = amount.multiply(BigDecimal.valueOf(0.029));
        BigDecimal fixedFee = BigDecimal.valueOf(0.30);

        // International cards have additional 1.5% fee
        if (isInternational) {
            BigDecimal internationalFee = amount.multiply(BigDecimal.valueOf(0.015));
            return percentageFee.add(fixedFee).add(internationalFee);
        }

        return percentageFee.add(fixedFee);
    }

    /**
     * Get masked card number for display (e.g., "**** **** **** 1234")
     */
    public String getMaskedCardNumber() {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }

        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        return "**** **** **** " + lastFour;
    }

    /**
     * Check if card is expired
     */
    public boolean isExpired() {
        try {
            int expMonth = Integer.parseInt(expiryMonth);
            int expYear = Integer.parseInt(expiryYear);
            LocalDateTime now = LocalDateTime.now();

            return expYear < now.getYear() ||
                    (expYear == now.getYear() && expMonth < now.getMonthValue());
        } catch (NumberFormatException e) {
            return true; // Invalid date format = expired
        }
    }

    // Static helper methods
    private static String detectCardType(String cardNumber) {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5") || cardNumber.startsWith("2")) return "MASTERCARD";
        if (cardNumber.startsWith("3")) return "AMEX";
        if (cardNumber.startsWith("6")) return "DISCOVER";
        return "UNKNOWN";
    }

    private static boolean isValidCardNumber(String cardNumber) {
        // Simplified Luhn algorithm check
        return cardNumber != null &&
                cardNumber.matches("\\d{13,19}") &&
                luhnCheck(cardNumber);
    }

    private static boolean isValidExpiryDate(String month, String year) {
        try {
            int expMonth = Integer.parseInt(month);
            int expYear = Integer.parseInt(year);
            LocalDateTime now = LocalDateTime.now();

            return expMonth >= 1 && expMonth <= 12 &&
                    expYear >= now.getYear() &&
                    !(expYear == now.getYear() && expMonth < now.getMonthValue());
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private static boolean luhnCheck(String cardNumber) {
        int sum = 0;
        boolean alternate = false;

        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));

            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }

            sum += n;
            alternate = !alternate;
        }

        return (sum % 10 == 0);
    }
}