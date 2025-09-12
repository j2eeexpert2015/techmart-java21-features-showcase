package com.example.techmart.features.recordpatterns.service;

import com.example.techmart.features.recordpatterns.domain.*;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.CustomerTier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Payment Processing Service - Java 21 Pattern Matching for Switch Demo
 *
 * This service demonstrates the power of Java 21's pattern matching features through
 * realistic payment processing scenarios. It showcases:
 *
 * - Pattern matching for switch with sealed interfaces
 * - Guard conditions for complex business rules
 * - Record patterns with destructuring
 * - Exhaustive pattern matching without default cases
 */
@Service
public class PaymentProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentProcessingService.class);

    // Demo storage - in production this would be a proper database
    private final ConcurrentMap<String, PaymentProcessingResult> processingHistory = new ConcurrentHashMap<>();

    // Business rule constants
    private static final BigDecimal HIGH_VALUE_THRESHOLD = BigDecimal.valueOf(1000);
    private static final BigDecimal LARGE_TRANSFER_THRESHOLD = BigDecimal.valueOf(5000);
    private static final BigDecimal PREMIUM_DISCOUNT_RATE = BigDecimal.valueOf(0.10); // 10%

    /**
     * Main payment processing method - showcases Java 21 Pattern Matching for Switch
     *
     * This is the core demonstration of Java 21's pattern matching capabilities.
     * The switch expression uses sealed interfaces, record patterns, and guard conditions
     * to implement complex payment processing logic in a clean, maintainable way.
     */
    public PaymentProcessingResult processPayment(PaymentMethod paymentMethod, BigDecimal amount, Customer customer) {
        logger.info("Processing payment for customer {} using {}", customer.username(), paymentMethod.getType());

        // Validate inputs
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        if (customer == null) {
            throw new IllegalArgumentException("Customer cannot be null");
        }

        // Pre-validation
        if (!paymentMethod.isValid()) {
            PaymentProcessingResult result = PaymentProcessingResult.declined(
                    paymentMethod, amount, "Invalid payment method details", paymentMethod.getType()
            );
            processingHistory.put(result.transactionId().toString(), result);
            return result;
        }

        // ============================================================================
        // JAVA 21 PATTERN MATCHING FOR SWITCH - MAIN DEMONSTRATION
        // ============================================================================

        PaymentProcessingResult result = switch (paymentMethod) {

            // Credit Card Pattern Matching with Complex Guard Conditions
            case CreditCard(var number, var type, var cvv, var month, var year, var name, var isInternational, var createdAt)
                    when amount.compareTo(HIGH_VALUE_THRESHOLD) > 0 && isInternational -> {

                logger.info("High-value international credit card transaction detected: ${} {}", amount, type);

                yield PaymentProcessingResult.requiresVerification(
                        paymentMethod,
                        amount,
                        "amount > $1000 && isInternational",
                        "CreditCard",
                        "High-value international transaction requires additional verification"
                );
            }

            case CreditCard(var number, var type, var cvv, var month, var year, var name, var isInternational, var createdAt)
                    when amount.compareTo(HIGH_VALUE_THRESHOLD) > 0 -> {

                logger.info("High-value domestic credit card transaction: ${} {}", amount, type);

                yield PaymentProcessingResult.success(
                        paymentMethod,
                        amount,
                        "CreditCard",
                        "processHighValueDomestic"
                );
            }

            case CreditCard(var number, var type, var cvv, var month, var year, var name, var isInternational, var createdAt) -> {

                logger.info("Standard credit card processing: ${} {}", amount, type);

                yield PaymentProcessingResult.success(
                        paymentMethod,
                        amount,
                        "CreditCard",
                        "processStandardCreditCard"
                );
            }

            // PayPal Pattern Matching with Customer Tier Guards
            case PayPal(var email, var accountId, var isVerified, var saveForFuture, var createdAt)
                    when customer.isPremium() -> {

                logger.info("Premium customer PayPal transaction: {} for {}", email, customer.tier());

                BigDecimal discount = amount.multiply(PREMIUM_DISCOUNT_RATE);

                yield PaymentProcessingResult.expedited(
                        paymentMethod,
                        amount,
                        "PayPal",
                        customer.tier().toString(),
                        discount
                );
            }

            case PayPal(var email, var accountId, var isVerified, var saveForFuture, var createdAt)
                    when !isVerified -> {

                logger.warn("Unverified PayPal account attempted payment: {}", email);

                yield PaymentProcessingResult.declined(
                        paymentMethod,
                        amount,
                        "PayPal account not verified",
                        "PayPal"
                );
            }

            case PayPal(var email, var accountId, var isVerified, var saveForFuture, var createdAt) -> {

                logger.info("Standard PayPal processing for verified account: {}", email);

                yield PaymentProcessingResult.success(
                        paymentMethod,
                        amount,
                        "PayPal",
                        "processStandardPayPal"
                );
            }

            // Bank Transfer Pattern Matching with Amount-based Guards
            case BankTransfer(var account, var routing, var bankName, var accountType, var holderName, var createdAt)
                    when amount.compareTo(LARGE_TRANSFER_THRESHOLD) >= 0 -> {

                logger.info("Large bank transfer requires approval: ${} from {}", amount, bankName);

                yield PaymentProcessingResult.requiresApproval(
                        paymentMethod,
                        amount,
                        "amount >= $5000",
                        "BankTransfer",
                        "Large bank transfer requires manager approval"
                );
            }

            case BankTransfer(var account, var routing, var bankName, var accountType, var holderName, var createdAt)
                    when !isValidRoutingNumber(routing) -> {

                logger.warn("Invalid routing number for bank transfer: {}", routing);

                yield PaymentProcessingResult.declined(
                        paymentMethod,
                        amount,
                        "Invalid bank routing number",
                        "BankTransfer"
                );
            }

            case BankTransfer(var account, var routing, var bankName, var accountType, var holderName, var createdAt) -> {

                logger.info("Standard bank transfer processing: ${} to {}", amount, bankName);

                yield PaymentProcessingResult.success(
                        paymentMethod,
                        amount,
                        "BankTransfer",
                        "processStandardBankTransfer"
                );
            }

            // Note: No default case needed due to sealed interface - compiler ensures exhaustiveness
        };

        // Store result for demo purposes
        processingHistory.put(result.transactionId().toString(), result);

        // Log the pattern matching result for educational purposes
        logPatternMatchingResult(result, customer);

        return result;
    }

    /**
     * Get processing history for demo purposes
     */
    public List<PaymentProcessingResult> getProcessingHistory() {
        return new ArrayList<>(processingHistory.values());
    }

    /**
     * Clear processing history (for demo reset)
     */
    public void clearHistory() {
        processingHistory.clear();
        logger.info("Payment processing history cleared");
    }

    /**
     * Simulate different customer scenarios for demo purposes
     */
    public PaymentProcessingResult processPaymentForDemoScenario(
            PaymentMethod paymentMethod,
            BigDecimal amount,
            String customerTier,
            boolean isInternational) {

        // Create demo customer
        Customer demoCustomer = createDemoCustomer(customerTier);

        // Modify payment method for demo scenario if needed
        PaymentMethod scenarioPaymentMethod = adjustPaymentMethodForScenario(paymentMethod, isInternational);

        return processPayment(scenarioPaymentMethod, amount, demoCustomer);
    }

    /**
     * Get payment processing statistics for demo dashboard
     */
    public PaymentProcessingStats getProcessingStats() {
        List<PaymentProcessingResult> results = getProcessingHistory();

        long totalProcessed = results.size();
        long successfulPayments = results.stream().filter(PaymentProcessingResult::isSuccessful).count();
        long requiresVerification = results.stream().filter(r -> r.status() == PaymentProcessingResult.ProcessingStatus.REQUIRES_VERIFICATION).count();
        long requiresApproval = results.stream().filter(r -> r.status() == PaymentProcessingResult.ProcessingStatus.REQUIRES_APPROVAL).count();
        long declined = results.stream().filter(PaymentProcessingResult::hasFailed).count();
        BigDecimal totalAmount = results.stream().map(PaymentProcessingResult::amount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PaymentProcessingStats(totalProcessed, successfulPayments, requiresVerification, requiresApproval, declined, totalAmount);
    }

    // ============================================================================
    // HELPER METHODS - FIXED IMPLEMENTATIONS
    // ============================================================================

    /**
     * Helper to validate a bank routing number using ABA checksum algorithm.
     * This method was missing, causing compilation error.
     */
    private boolean isValidRoutingNumber(String routingNumber) {
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
     * Helper to log the outcome of pattern matching for educational purposes.
     * This method was missing, causing compilation error.
     */
    private void logPatternMatchingResult(PaymentProcessingResult result, Customer customer) {
        String logMessage = String.format(
                "Pattern Match Result -> [Customer: %s (%s), PaymentType: %s, Pattern: %s, Guard: '%s', Action: %s, Status: %s]",
                customer.username(),
                customer.tier(),
                result.paymentMethod().getType(),
                result.patternMatched(),
                result.guardCondition(),
                result.processingAction(),
                result.status()
        );
        logger.info(logMessage);
    }

    /**
     * Helper to create a demo customer based on a tier string.
     * This method was missing, causing compilation error.
     */
    private Customer createDemoCustomer(String tier) {
        CustomerTier customerTier = CustomerTier.BASIC;
        try {
            if (tier != null) {
                customerTier = CustomerTier.valueOf(tier.toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid customer tier string '{}', defaulting to BASIC.", tier);
        }
        return new Customer(1L, "demo_user", "demo@example.com", "Demo User", customerTier, null, LocalDateTime.now(), true);
    }

    /**
     * Helper to adjust a payment method for a specific demo scenario.
     * This method was missing, causing compilation error.
     */
    private PaymentMethod adjustPaymentMethodForScenario(PaymentMethod paymentMethod, boolean isInternational) {
        if (paymentMethod instanceof CreditCard cc) {
            // Return a new record with the 'isInternational' flag updated
            return new CreditCard(
                    cc.cardNumber(), cc.cardType(), cc.cvv(), cc.expiryMonth(), cc.expiryYear(),
                    cc.cardholderName(), isInternational, cc.createdAt()
            );
        }
        // Return original payment method if not a CreditCard
        return paymentMethod;
    }
}