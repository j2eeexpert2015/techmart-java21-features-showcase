package com.example.techmart.shared.domain;

/**
 * TechMart Address - Value object for customer and shipping addresses
 *
 * Used in:
 * - Customer profiles
 * - Shipping calculations
 * - International payment processing
 * - Tax calculations
 */
public record Address(
        String street,
        String city,
        String state,
        String zipCode,
        String country
) {

    /**
     * Check if this is a domestic US address
     * Used for shipping and payment processing decisions
     */
    public boolean isDomestic() {
        return country != null &&
                (country.equalsIgnoreCase("USA") ||
                        country.equalsIgnoreCase("United States"));
    }

    /**
     * Check if this address is international
     * Used in payment processing for international fees
     */
    public boolean isInternational() {
        return !isDomestic();
    }

    /**
     * Get formatted address for display
     * Used in string template demonstrations
     */
    public String getFormattedAddress() {
        StringBuilder sb = new StringBuilder();

        if (street != null && !street.isBlank()) {
            sb.append(street);
        }

        if (city != null && !city.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(city);
        }

        if (state != null && !state.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(state);
        }

        if (zipCode != null && !zipCode.isBlank()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(zipCode);
        }

        if (country != null && !country.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(country);
        }

        return sb.toString();
    }

    /**
     * Get country code for shipping calculations
     * Used in logistics and payment processing
     */
    public String getCountryCode() {
        if (country == null) return "US";

        return switch (country.toUpperCase()) {
            case "USA", "UNITED STATES" -> "US";
            case "CANADA" -> "CA";
            case "UNITED KINGDOM", "UK" -> "GB";
            case "GERMANY" -> "DE";
            case "FRANCE" -> "FR";
            case "JAPAN" -> "JP";
            default -> country.substring(0, Math.min(2, country.length())).toUpperCase();
        };
    }

    /**
     * Compact constructor with validation
     */
    public Address {
        // Normalize country name
        if (country != null) {
            country = country.trim();
            if (country.equalsIgnoreCase("US") || country.equalsIgnoreCase("USA")) {
                country = "United States";
            }
        }
    }
}