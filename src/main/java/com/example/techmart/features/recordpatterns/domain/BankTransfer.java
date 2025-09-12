package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Bank Transfer Payment Method Record
 * Supports ACH transfers with manager approval for large amounts
 *
 * This record implements the PaymentMethod sealed interface and demonstrates
 * Java 21 record patterns with banking validation logic and routing number verification.
 */
public record BankTransfer(
        String accountNumber,
        String routingNumber,
        String bankName,
        String accountType,
        String accountHolderName,
        LocalDateTime createdAt
) implements PaymentMethod {

    /**
     * Compact constructor with validation
     */
    public BankTransfer {
        if (accountNumber == null || !accountNumber.matches("\\d{8,17}")) {
            throw new IllegalArgumentException("Invalid account number format");
        }

        if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
            throw new IllegalArgumentException("Invalid routing number format");
        }

        if (accountType == null) {
            accountType = "CHECKING"; // Default account type
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Override
    public String getType() {
        return "BANK_TRANSFER";
    }

    @Override
    public boolean isValid() {
        return accountNumber != null && accountNumber.matches("\\d{8,17}") &&
                routingNumber != null && routingNumber.matches("\\d{9}") &&
                bankName != null && !bankName.isBlank() &&
                accountHolderName != null && !accountHolderName.isBlank();
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // Bank transfer fee: flat $1.50 for standard, $0 for large amounts over $1000
        return amount.compareTo(BigDecimal.valueOf(1000)) >= 0 ?
                BigDecimal.ZERO : BigDecimal.valueOf(1.50);
    }

    /**
     * Get masked account number for display (e.g., "****1234")
     */
    public String getMaskedAccountNumber() {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }

        String lastFour = accountNumber.substring(accountNumber.length() - 4);
        return "****" + lastFour;
    }

    /**
     * Check if routing number is valid using standard checksum
     */
    public boolean isValidRoutingNumber() {
        if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
            return false;
        }

        // ABA routing number checksum validation
        int[] weights = {3, 7, 1, 3, 7, 1, 3, 7, 1};
        int sum = 0;

        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(routingNumber.charAt(i)) * weights[i];
        }

        return sum % 10 == 0;
    }

    /**
     * Get estimated processing time based on amount and account type
     */
    public String getProcessingTime(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.valueOf(5000)) >= 0) {
            return "5-7 business days (manager approval required)";
        } else if ("SAVINGS".equals(accountType)) {
            return "4-6 business days";
        } else {
            return "3-5 business days";
        }
    }
}