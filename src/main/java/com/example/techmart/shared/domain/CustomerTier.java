package com.example.techmart.shared.domain;

/**
 * TechMart Customer Tier - Business classification for customer benefits
 *
 * Used throughout the application for:
 * - Payment processing (fee calculations)
 * - Shipping decisions (express vs standard)
 * - Customer service routing (priority levels)
 * - Feature access (VIP-only features)
 */
public enum CustomerTier {

    /**
     * Basic tier - standard customers
     * - Standard shipping rates
     * - Normal processing fees
     * - Regular customer support
     */
    BASIC("Basic", "Standard customer tier"),

    /**
     * Premium tier - customers with enhanced benefits
     * - Reduced processing fees
     * - Priority customer support
     * - Express shipping options
     */
    PREMIUM("Premium", "Enhanced benefits and priority support"),

    /**
     * VIP tier - top-tier customers with maximum benefits
     * - No processing fees
     * - Express shipping included
     * - Dedicated customer support
     * - Early access to features
     */
    VIP("VIP", "Maximum benefits with dedicated support");

    private final String displayName;
    private final String description;

    CustomerTier(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Get the processing fee multiplier for this tier
     * Used in payment processing demonstrations
     */
    public double getFeeMultiplier() {
        return switch (this) {
            case VIP -> 0.0;      // No fees for VIP
            case PREMIUM -> 0.5;   // 50% discount for Premium
            case BASIC -> 1.0;     // Full fees for Basic
        };
    }

    /**
     * Check if this tier qualifies for express shipping
     * Used in order processing logic
     */
    public boolean hasExpressShipping() {
        return this == PREMIUM || this == VIP;
    }
}