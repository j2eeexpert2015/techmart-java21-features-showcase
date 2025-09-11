package com.example.techmart.shared.domain;

import java.time.LocalDateTime;

/**
 * TechMart Customer - Core domain model demonstrating Java 21 Records
 *
 * This record represents a TechMart e-commerce customer with realistic business logic.
 * Used across all Java 21 feature demonstrations to provide consistent business context.
 *
 * Business Rules:
 * - BASIC: Standard customers (default tier)
 * - PREMIUM: Customers with benefits (reduced fees, priority support)
 * - VIP: Top-tier customers (express shipping, no fees, dedicated support)
 */
public record Customer(
        Long id,
        String username,
        String email,
        String fullName,
        CustomerTier tier,
        Address address,
        LocalDateTime createdAt,
        boolean active
) {

    // Business logic methods - demonstrate record capabilities

    /**
     * Check if customer has premium benefits
     * Used in payment processing for fee calculations
     */
    public boolean isPremium() {
        return tier == CustomerTier.PREMIUM || tier == CustomerTier.VIP;
    }

    /**
     * Check if customer is VIP
     * Used in shipping and customer service routing
     */
    public boolean isVip() {
        return tier == CustomerTier.VIP;
    }

    /**
     * Get customer display name for notifications
     * Used in string template demonstrations
     */
    public String getDisplayName() {
        return fullName != null && !fullName.isBlank() ? fullName : username;
    }

    /**
     * Check if customer qualifies for express shipping
     * Used in order processing and sequenced collections demos
     */
    public boolean qualifiesForExpressShipping() {
        return isPremium();
    }

    /**
     * Get customer service priority level
     * Used in unnamed patterns for service routing
     */
    public String getServicePriority() {
        return switch (tier) {
            case VIP -> "URGENT";
            case PREMIUM -> "HIGH";
            case BASIC -> "NORMAL";
        };
    }

    /**
     * Check if customer is in specific geographic region
     * Used in payment processing for international fees
     */
    public boolean isInternational() {
        return address != null &&
                address.country() != null &&
                !address.country().equalsIgnoreCase("USA");
    }

    /**
     * Compact constructor with validation
     * Demonstrates record validation patterns
     */
    public Customer {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }
        if (tier == null) {
            tier = CustomerTier.BASIC; // Default tier
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}