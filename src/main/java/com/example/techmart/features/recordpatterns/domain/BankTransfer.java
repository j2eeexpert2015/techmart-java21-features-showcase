package com.example.techmart.features.recordpatterns.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Bank Transfer Payment Method Record
 *
 * Demonstrates Java 21 record patterns with amount-based guard conditions.
 * Shows how large transfers can trigger different processing workflows
 * through pattern matching with guards.
 *
 * Java 21 Features Demonstrated:
 * - Record pattern: case BankTransfer(var account, var routing, var bank) -> ...
 * - Amount-based guards: when amount >= 5000 -> require approval
 * - Business rule enforcement through pattern matching
 */
public record BankTransfer(
        String accountNumber,
        String routingNumber,
        String bankName,
        String accountType,
        String accountHolderName,
        LocalDateTime createdAt
) implements PaymentMethod {

    // Compact constructor with validation
    public BankTransfer {
        // Basic validation for demo
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("Account number cannot be empty");
        }

        if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
            throw new IllegalArgumentException("Routing number must be 9 digits");
        }

        if (bankName == null || bankName.isBlank()) {
            throw new IllegalArgumentException("Bank name cannot be empty");
        }

        // Default account type if not specified
        if (accountType == null || accountType.isBlank()) {
            accountType = "CHECKING";
        }

        // Set creation time if not provided
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Override
    public String getType() {
        return "BankTransfer";
    }

    @Override
    public boolean isValid() {
        // Basic validation for demo
        return accountNumber != null &&
                accountNumber.matches("\\d{8,17}") &&
                routingNumber != null &&
                routingNumber.matches("\\d{9}") &&
                bankName != null &&
                !bankName.isBlank() &&
                accountHolderName != null &&
                !accountHolderName.isBlank();
    }

    @Override
    public BigDecimal getProcessingFee(BigDecimal amount) {
        // Bank transfer fee structure for demo
        // Small fee for standard transfers, free for large amounts
        return amount.compareTo(BigDecimal.valueOf(1000)) >= 0 ?
                BigDecimal.ZERO :
                BigDecimal.valueOf(1.50);
    }

    // Helper method: Get masked account number for display
    public String getMaskedAccountNumber() {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }
        String lastFour = accountNumber.substring(accountNumber.length() - 4);
        return "****" + lastFour;
    }

    // Helper method: Simple routing number validation for demo
    public boolean isValidRoutingNumber() {
        if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
            return false;
        }

        // Simplified validation - just check it's 9 digits
        // In real implementation, would use ABA checksum algorithm
        return true;
    }

    // Helper method: Get estimated processing time based on amount
    public String getProcessingTime(BigDecimal amount) {
        // Large transfers take longer due to additional approvals
        if (amount.compareTo(BigDecimal.valueOf(5000)) >= 0) {
            return "5-7 business days (manager approval required)";
        } else {
            return "3-5 business days";
        }
    }
}