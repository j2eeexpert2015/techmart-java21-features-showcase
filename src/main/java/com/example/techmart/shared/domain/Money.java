package com.example.techmart.shared.domain;

import java.math.BigDecimal;
import java.util.Currency;

/**
 * A value object representing a monetary amount with its currency.
 *
 * Using a dedicated Money object instead of primitive types like BigDecimal helps
 * prevent errors related to currency mismatches and improves type safety throughout
 * the application, especially in payment and pricing contexts.
 *
 * @param amount   The numerical value of the money.
 * @param currency The currency of the amount (e.g., USD, EUR).
 */
public record Money(
        BigDecimal amount,
        Currency currency
) {
    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new Money(amount.add(other.amount), currency);
    }
}