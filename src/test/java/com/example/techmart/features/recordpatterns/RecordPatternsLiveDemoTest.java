package com.example.techmart.features.recordpatterns;

import com.example.techmart.features.recordpatterns.domain.*;
import com.example.techmart.features.recordpatterns.service.PaymentProcessingService;
import com.example.techmart.shared.domain.Customer;
import com.example.techmart.shared.domain.CustomerTier;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Live Demo Tests for Java 21 Record Patterns and Pattern Matching
 *
 * These tests demonstrate Java 21's pattern matching features through
 * realistic payment processing scenarios. Each test showcases different
 * aspects of the new language capabilities.
 *
 * Run these tests to see Java 21 pattern matching in action!
 */
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Java 21 Record Patterns - Payment Processing Live Demo")
class RecordPatternsLiveDemoTest {

    private PaymentProcessingService paymentService;
    private Customer basicCustomer;
    private Customer premiumCustomer;
    private Customer vipCustomer;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentProcessingService();

        // Create demo customers with different tiers for testing business rules
        basicCustomer = new Customer(
                1L, "john_basic", "john@example.com", "John Basic",
                CustomerTier.BASIC, null, LocalDateTime.now(), true
        );

        premiumCustomer = new Customer(
                2L, "alice_premium", "alice@example.com", "Alice Premium",
                CustomerTier.PREMIUM, null, LocalDateTime.now(), true
        );

        vipCustomer = new Customer(
                3L, "bob_vip", "bob@example.com", "Bob VIP",
                CustomerTier.VIP, null, LocalDateTime.now(), true
        );
    }

    @Test
    @DisplayName("Demo 1: Credit Card Pattern Matching with Guard Conditions")
    void demonstrateCreditCardPatternMatching() {
        System.out.println("\n🎯 DEMO 1: Credit Card Pattern Matching with Guards");
        System.out.println("===============================================");

        // Test 1: Standard domestic credit card (no guards triggered)
        CreditCard domesticCard = new CreditCard(
                "4111111111111111", "VISA", "123", "12", "2026",
                "John Doe", false, LocalDateTime.now()
        );

        PaymentProcessingResult result1 = paymentService.processPayment(
                domesticCard, BigDecimal.valueOf(500), basicCustomer
        );

        System.out.println("💳 Standard domestic transaction ($500):");
        System.out.println("   Pattern: " + result1.patternMatched());
        System.out.println("   Guard: " + result1.guardCondition());
        System.out.println("   Action: " + result1.processingAction());
        System.out.println("   Status: " + result1.status());

        // Test 2: High-value domestic (amount guard triggered)
        PaymentProcessingResult result2 = paymentService.processPayment(
                domesticCard, BigDecimal.valueOf(1500), basicCustomer
        );

        System.out.println("\n💳 High-value domestic transaction ($1,500):");
        System.out.println("   Pattern: " + result2.patternMatched());
        System.out.println("   Guard: " + result2.guardCondition());
        System.out.println("   Action: " + result2.processingAction());
        System.out.println("   Status: " + result2.status());

        // Test 3: High-value international (complex guard triggered)
        CreditCard internationalCard = new CreditCard(
                "4111111111111111", "VISA", "123", "12", "2026",
                "Jean Dupont", true, LocalDateTime.now()
        );

        PaymentProcessingResult result3 = paymentService.processPayment(
                internationalCard, BigDecimal.valueOf(1500), basicCustomer
        );

        System.out.println("\n💳 High-value international transaction ($1,500):");
        System.out.println("   Pattern: " + result3.patternMatched());
        System.out.println("   Guard: " + result3.guardCondition());
        System.out.println("   Action: " + result3.processingAction());
        System.out.println("   Status: " + result3.status());

        // Verify the pattern matching worked correctly
        assertThat(result1.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.APPROVED);
        assertThat(result1.guardCondition()).isEqualTo("none");

        assertThat(result2.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.APPROVED);
        assertThat(result2.guardCondition()).isEqualTo("amount > $1000");

        assertThat(result3.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.REQUIRES_VERIFICATION);
        assertThat(result3.guardCondition()).isEqualTo("amount > $1000 && isInternational");

        System.out.println("\n✅ Java 21 Record Pattern Destructuring Success!");
        System.out.println("   • Direct access to record components in switch");
        System.out.println("   • Guard conditions implement business rules");
        System.out.println("   • Type-safe pattern matching with automatic casting");
    }

    @Test
    @DisplayName("Demo 2: PayPal Pattern Matching with Customer Tiers")
    void demonstratePayPalPatternMatching() {
        System.out.println("\n🎯 DEMO 2: PayPal Customer Tier Pattern Matching");
        System.out.println("===============================================");

        PayPal verifiedPayPal = new PayPal(
                "customer@example.com", "PP_ACCOUNT_123",
                true, false, LocalDateTime.now()
        );

        // Test 1: Basic customer with PayPal (standard processing)
        PaymentProcessingResult result1 = paymentService.processPayment(
                verifiedPayPal, BigDecimal.valueOf(1000), basicCustomer
        );

        System.out.println("💙 Basic customer PayPal ($1,000):");
        System.out.println("   Customer Tier: " + basicCustomer.tier());
        System.out.println("   Pattern: " + result1.patternMatched());
        System.out.println("   Guard: " + result1.guardCondition());
        System.out.println("   Status: " + result1.status());
        System.out.println("   Processing Fee: $" + result1.processingFee());

        // Test 2: Premium customer with PayPal (expedited processing)
        PaymentProcessingResult result2 = paymentService.processPayment(
                verifiedPayPal, BigDecimal.valueOf(1000), premiumCustomer
        );

        System.out.println("\n💙 Premium customer PayPal ($1,000):");
        System.out.println("   Customer Tier: " + premiumCustomer.tier());
        System.out.println("   Pattern: " + result2.patternMatched());
        System.out.println("   Guard: " + result2.guardCondition());
        System.out.println("   Status: " + result2.status());
        System.out.println("   Processing Fee: $" + result2.processingFee());
        System.out.println("   Discount Applied: Premium customer benefits");

        // Test 3: Unverified PayPal account (declined)
        PayPal unverifiedPayPal = new PayPal(
                "unverified@example.com", "PP_UNVERIFIED",
                false, false, LocalDateTime.now()
        );

        PaymentProcessingResult result3 = paymentService.processPayment(
                unverifiedPayPal, BigDecimal.valueOf(500), basicCustomer
        );

        System.out.println("\n💙 Unverified PayPal account ($500):");
        System.out.println("   Pattern: " + result3.patternMatched());
        System.out.println("   Guard: " + result3.guardCondition());
        System.out.println("   Status: " + result3.status());
        System.out.println("   Reason: " + result3.validationMessages());

        // Verify customer tier-based processing
        assertThat(result1.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.APPROVED);
        assertThat(result1.guardCondition()).isEqualTo("none");

        assertThat(result2.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.APPROVED);
        assertThat(result2.guardCondition()).isEqualTo("isPremiumCustomer");
        assertThat(result2.processingFee()).isLessThan(result1.processingFee());

        assertThat(result3.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.DECLINED);

        System.out.println("\n✅ Customer Tier Guard Conditions Success!");
        System.out.println("   • Business rules enforced through guard conditions");
        System.out.println("   • Premium customers get automatic benefits");
        System.out.println("   • Security validation through pattern matching");
    }

    @Test
    @DisplayName("Demo 3: Bank Transfer Amount-Based Guards")
    void demonstrateBankTransferPatternMatching() {
        System.out.println("\n🎯 DEMO 3: Bank Transfer Amount-Based Pattern Matching");
        System.out.println("==================================================");

        BankTransfer validBankTransfer = new BankTransfer(
                "1234567890", "021000021", "Chase Bank",
                "CHECKING", "John Doe", LocalDateTime.now()
        );

        // Test 1: Standard bank transfer (under threshold)
        PaymentProcessingResult result1 = paymentService.processPayment(
                validBankTransfer, BigDecimal.valueOf(2000), basicCustomer
        );

        System.out.println("🏦 Standard bank transfer ($2,000):");
        System.out.println("   Pattern: " + result1.patternMatched());
        System.out.println("   Guard: " + result1.guardCondition());
        System.out.println("   Status: " + result1.status());
        System.out.println("   Processing Time: " + result1.processingTimeEstimate());

        // Test 2: Large bank transfer (requires approval)
        PaymentProcessingResult result2 = paymentService.processPayment(
                validBankTransfer, BigDecimal.valueOf(6000), basicCustomer
        );

        System.out.println("\n🏦 Large bank transfer ($6,000):");
        System.out.println("   Pattern: " + result2.patternMatched());
        System.out.println("   Guard: " + result2.guardCondition());
        System.out.println("   Status: " + result2.status());
        System.out.println("   Processing Time: " + result2.processingTimeEstimate());
        System.out.println("   Required Action: Manager approval needed");

        // Test 3: Invalid routing number (validation guard)
        BankTransfer invalidBankTransfer = new BankTransfer(
                "1234567890", "123456789", "Invalid Bank",
                "CHECKING", "John Doe", LocalDateTime.now()
        );

        PaymentProcessingResult result3 = paymentService.processPayment(
                invalidBankTransfer, BigDecimal.valueOf(1000), basicCustomer
        );

        System.out.println("\n🏦 Invalid routing number:");
        System.out.println("   Pattern: " + result3.patternMatched());
        System.out.println("   Guard: " + result3.guardCondition());
        System.out.println("   Status: " + result3.status());
        System.out.println("   Reason: " + result3.validationMessages());

        // Verify amount-based routing
        assertThat(result1.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.APPROVED);
        assertThat(result1.guardCondition()).isEqualTo("none");

        assertThat(result2.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.REQUIRES_APPROVAL);
        assertThat(result2.guardCondition()).isEqualTo("amount >= $5000");

        assertThat(result3.status()).isEqualTo(PaymentProcessingResult.ProcessingStatus.DECLINED);

        System.out.println("\n✅ Amount-Based Guard Conditions Success!");
        System.out.println("   • Different processing rules based on amount");
        System.out.println("   • Validation logic integrated into pattern matching");
        System.out.println("   • Business workflow automation through guards");
    }

    @Test
    @DisplayName("Demo 4: Exhaustive Pattern Matching - No Default Case")
    void demonstrateExhaustivePatternMatching() {
        System.out.println("\n🎯 DEMO 4: Exhaustive Pattern Matching (No Default Case)");
        System.out.println("======================================================");

        // Create one instance of each payment method type
        PaymentMethod[] paymentMethods = {
                new CreditCard("4111111111111111", "VISA", "123", "12", "2026",
                        "Test User", false, LocalDateTime.now()),
                new PayPal("test@example.com", "PP_123", true, false, LocalDateTime.now()),
                new BankTransfer("1234567890", "021000021", "Test Bank",
                        "CHECKING", "Test User", LocalDateTime.now())
        };

        System.out.println("Testing all payment methods with sealed interface:");

        for (PaymentMethod method : paymentMethods) {
            PaymentProcessingResult result = paymentService.processPayment(
                    method, BigDecimal.valueOf(500), basicCustomer
            );

            System.out.println("   " + method.getType() + " → Pattern: " +
                    result.patternMatched() + " → Status: " + result.status());

            // Verify each payment method was properly handled
            assertThat(result.patternMatched()).isIn("CreditCard", "PayPal", "BankTransfer");
        }

        System.out.println("\n✅ Exhaustive Matching Success!");
        System.out.println("   • Sealed interface enables exhaustive switching");
        System.out.println("   • Compiler guarantees all cases are handled");
        System.out.println("   • No default case needed - type safety guaranteed");
        System.out.println("   • Impossible to forget a payment method type");
    }

    @Test
    @DisplayName("Demo 5: Processing Statistics from Pattern Matching")
    void demonstrateProcessingStatistics() {
        System.out.println("\n🎯 DEMO 5: Processing Statistics Dashboard");
        System.out.println("=========================================");

        // Process various payments to generate statistics
        CreditCard card = new CreditCard("4111111111111111", "VISA", "123", "12", "2026",
                "Test User", false, LocalDateTime.now());
        PayPal paypal = new PayPal("test@example.com", "PP_123", true, false, LocalDateTime.now());
        BankTransfer bank = new BankTransfer("1234567890", "021000021", "Test Bank",
                "CHECKING", "Test User", LocalDateTime.now());

        // Create different scenarios for statistics
        paymentService.processPayment(card, BigDecimal.valueOf(500), basicCustomer);      // Approved
        paymentService.processPayment(card, BigDecimal.valueOf(1500), basicCustomer);     // Approved (high value)
        paymentService.processPayment(paypal, BigDecimal.valueOf(1000), premiumCustomer); // Approved (expedited)
        paymentService.processPayment(bank, BigDecimal.valueOf(6000), basicCustomer);     // Requires approval

        // Get statistics from pattern matching results
        var stats = paymentService.getProcessingStats();

        System.out.println("📊 Pattern Matching Results:");
        System.out.println("   Total Processed: " + stats.totalProcessed());
        System.out.println("   Successful: " + stats.successfulPayments());
        System.out.println("   Requires Approval: " + stats.requiresApproval());
        System.out.println("   Success Rate: " + String.format("%.1f%%", stats.getSuccessRate()));
        System.out.println("   Total Amount: $" + stats.totalAmount());
        System.out.println("   Average Amount: $" + stats.getAverageTransactionAmount());

        // Verify statistics are calculated correctly
        assertThat(stats.totalProcessed()).isEqualTo(4);
        assertThat(stats.successfulPayments()).isEqualTo(3);
        assertThat(stats.requiresApproval()).isEqualTo(1);
        assertThat(stats.getSuccessRate()).isEqualTo(75.0);

        System.out.println("\n✅ Statistics Generation Success!");
        System.out.println("   • Real-time metrics from pattern matching decisions");
        System.out.println("   • Business intelligence from language features");
        System.out.println("   • Automatic categorization through pattern results");
    }

    @Test
    @DisplayName("Demo 6: Pattern Matching Education Summary")
    void demonstrateJava21Benefits() {
        System.out.println("\n🎯 DEMO 6: Java 21 Pattern Matching Benefits Summary");
        System.out.println("===================================================");

        System.out.println("🔥 Java 21 Language Features Demonstrated:");
        System.out.println("   ✅ Sealed Interfaces - Type-safe, exhaustive matching");
        System.out.println("   ✅ Record Patterns - Direct destructuring in switch");
        System.out.println("   ✅ Guard Conditions - Business rules in pattern matching");
        System.out.println("   ✅ Enhanced Switch - No fall-through, yield expressions");
        System.out.println("   ✅ Type Safety - Compiler-verified completeness");

        System.out.println("\n💡 Business Benefits:");
        System.out.println("   ✅ Cleaner Code - Less boilerplate, more readable");
        System.out.println("   ✅ Fewer Bugs - Exhaustive matching prevents oversight");
        System.out.println("   ✅ Better Performance - Optimized pattern matching");
        System.out.println("   ✅ Easier Maintenance - Add new types without breaking existing code");
        System.out.println("   ✅ Clear Logic - Business rules expressed declaratively");

        System.out.println("\n🚀 Ready for Production:");
        System.out.println("   ✅ Replace complex instanceof chains");
        System.out.println("   ✅ Implement state machines cleanly");
        System.out.println("   ✅ Handle polymorphic data processing");
        System.out.println("   ✅ Build type-safe APIs");
        System.out.println("   ✅ Create maintainable business rule engines");

        // This test always passes - it's just educational output
        assertThat(true).isTrue();
    }
}