package com.example.techmart.features.recordpatterns.controller;

import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * STEP 1: Simple Payment Controller
 *
 * Start with the basics - just one endpoint that works
 * No complex patterns yet, just demonstrate the concept
 */
@RestController
@RequestMapping("/api/simple")
public class SimplePaymentController {

    /**
     * STEP 1: Single endpoint to process payments
     * This demonstrates Java 21 pattern matching in the simplest way possible
     */
    @PostMapping("/payment")
    public Map<String, Object> processSimplePayment(@RequestBody SimplePaymentRequest request) {

        System.out.println("🚀 Processing payment: " + request.method() + " for $" + request.amount());

        // STEP 1: Simple pattern matching demonstration
        String result = switch (request.method()) {
            case "creditcard" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(1000)) > 0) {
                    yield "REQUIRES_VERIFICATION - High value credit card";
                } else {
                    yield "APPROVED - Credit card approved";
                }
            }
            case "paypal" -> "APPROVED - PayPal processed";
            case "bank" -> {
                if (request.amount().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                    yield "REQUIRES_APPROVAL - Large bank transfer";
                } else {
                    yield "APPROVED - Bank transfer approved";
                }
            }
            default -> "ERROR - Unknown payment method";
        };

        // STEP 1: Simple response
        return Map.of(
                "status", result.split(" - ")[0],
                "message", result.split(" - ")[1],
                "amount", request.amount(),
                "method", request.method(),
                "timestamp", LocalDateTime.now(),
                "java21_feature", "Pattern Matching for Switch"
        );
    }

    /**
     * STEP 1: Simple request record
     */
    public record SimplePaymentRequest(
            String method,
            BigDecimal amount
    ) {}
}