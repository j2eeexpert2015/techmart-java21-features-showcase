/**
 * Simple Payment Demo - JavaScript
 * Full Page Layout with Right-Side API Log
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
});

/**
 * Initialize the demo
 */
function initializeDemo() {
    setupPaymentMethodSelection();
    addLog('🚀 Simple Payment Demo initialized');
    addLog('Ready to demonstrate Java 21 Pattern Matching!');
    addLog('');
    addLog('Instructions:');
    addLog('1. Select a payment method on the left');
    addLog('2. Choose an amount');
    addLog('3. Click Process Payment');
    addLog('4. Watch the pattern matching results!');
    addLog('');
}

/**
 * Setup payment method selection handlers
 */
function setupPaymentMethodSelection() {
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
}

/**
 * Handle payment method selection
 */
function selectPaymentMethod(selectedCard) {
    // Remove selected class from all cards
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    selectedCard.classList.add('selected');

    // Update current method
    currentMethod = selectedCard.dataset.method;

    // Log the selection with visual separator
    addLog('─'.repeat(50));
    addLog(`🎯 Selected payment method: ${getMethodName(currentMethod)}`);
    addLog(`   Pattern: ${getPatternDescription(currentMethod)}`);
}

/**
 * Set the payment amount
 */
function setAmount(amount) {
    currentAmount = amount;
    document.getElementById('current-amount').textContent = `${amount.toLocaleString()}`;

    // Log with context
    addLog('─'.repeat(50));
    addLog(`💰 Amount set to: ${amount.toLocaleString()}`);
    addLog(`   This will ${getAmountContext(currentMethod, amount)}`);
}

/**
 * Process the payment (main demo function)
 */
function processPayment() {
    // Clear previous results and add header
    addLog('');
    addLog('🟰'.repeat(25) + ' PROCESSING PAYMENT ' + '🟰'.repeat(25));
    addLog(`💳 Method: ${getMethodName(currentMethod)}`);
    addLog(`💵 Amount: ${currentAmount.toLocaleString()}`);
    addLog('');

    // Simulate Java 21 pattern matching logic
    const result = simulatePatternMatching(currentMethod, currentAmount);

    // Show the result on left side
    showResult(result);

    // Log the final result with formatting
    addLog('✅ RESULT:');
    addLog(`   Status: ${result.status}`);
    addLog(`   Message: ${result.message}`);
    addLog(`   Java 21 Feature: ${result.pattern}`);
    addLog('');
    addLog('🎉 Pattern matching complete!');
    addLog('');
}

/**
 * Simulate Java 21 pattern matching with enhanced logging
 */
function simulatePatternMatching(method, amount) {
    addLog('🔥 Java 21 Pattern Matching Starting...');
    addLog(`   switch(${method}) {`);

    // This simulates the Java 21 pattern matching logic
    switch(method) {
        case 'creditcard':
            if (amount > 1000) {
                addLog(`   ➜ case CreditCard(var details)`);
                addLog(`     when amount > 1000 && isHighValue() {`);
                addLog(`       return requiresVerification();`);
                addLog(`     }`);
                return {
                    status: 'REQUIRES_VERIFICATION',
                    message: 'High-value credit card transaction requires additional verification',
                    pattern: 'CreditCard with guard condition (amount > $1,000)',
                    color: '#f59e0b'
                };
            } else {
                addLog(`   ➜ case CreditCard(var details) {`);
                addLog(`       return processStandard();`);
                addLog(`     }`);
                return {
                    status: 'APPROVED',
                    message: 'Credit card payment approved successfully',
                    pattern: 'CreditCard standard processing',
                    color: '#10b981'
                };
            }

        case 'paypal':
            addLog(`   ➜ case PayPal(var email, var verified) {`);
            addLog(`       return processPayPal();`);
            addLog(`     }`);
            return {
                status: 'APPROVED',
                message: 'PayPal payment processed successfully',
                pattern: 'PayPal standard processing',
                color: '#10b981'
            };

        case 'bank':
            if (amount >= 5000) {
                addLog(`   ➜ case BankTransfer(var account, var routing)`);
                addLog(`     when amount >= 5000 && requiresApproval() {`);
                addLog(`       return requiresManagerApproval();`);
                addLog(`     }`);
                return {
                    status: 'REQUIRES_APPROVAL',
                    message: 'Large bank transfer requires manager approval',
                    pattern: 'BankTransfer with approval workflow (amount ≥ $5,000)',
                    color: '#ef4444'
                };
            } else {
                addLog(`   ➜ case BankTransfer(var account, var routing) {`);
                addLog(`       return processStandard();`);
                addLog(`     }`);
                return {
                    status: 'APPROVED',
                    message: 'Bank transfer approved successfully',
                    pattern: 'BankTransfer standard processing',
                    color: '#10b981'
                };
            }

        default:
            addLog(`   ➜ // No default case needed with sealed types!`);
            return {
                status: 'ERROR',
                message: 'This should never happen with sealed interfaces',
                pattern: 'Sealed types eliminate need for default case',
                color: '#ef4444'
            };
    }
}

/**/**
 * Simple Payment Demo - JavaScript
 * Demonstrates Java 21 Pattern Matching
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
});

/**
 * Initialize the demo
 */
function initializeDemo() {
    setupPaymentMethodSelection();
    addLog('Simple Payment Demo initialized');
    addLog('Ready to demonstrate Java 21 Pattern Matching!');
}

/**
 * Setup payment method selection handlers
 */
function setupPaymentMethodSelection() {
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
}

/**
 * Handle payment method selection
 */
function selectPaymentMethod(selectedCard) {
    // Remove selected class from all cards
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    selectedCard.classList.add('selected');

    // Update current method
    currentMethod = selectedCard.dataset.method;

    // Log the selection
    addLog(`Selected payment method: ${currentMethod}`);
}

/**
 * Set the payment amount
 */
function setAmount(amount) {
    currentAmount = amount;
    document.getElementById('current-amount').textContent = `$${amount.toLocaleString()}`;
    addLog(`Amount set to: $${amount.toLocaleString()}`);
}

/**
 * Process the payment (main demo function)
 */
function processPayment() {
    addLog(`Processing payment: ${currentMethod} for $${currentAmount.toLocaleString()}`);

    // Simulate Java 21 pattern matching logic
    const result = simulatePatternMatching(currentMethod, currentAmount);

    // Show the result
    showResult(result);

    // Log the final result
    addLog(`Result: ${result.status} - ${result.message}`);
}

/**
 * Simulate Java 21 pattern matching
 * This demonstrates the switch expression with guard conditions
 */
function simulatePatternMatching(method, amount) {
    addLog(`🔥 Java 21 Pattern Matching: switch(${method})`);

    // This simulates the Java 21 pattern matching logic
    switch(method) {
        case 'creditcard':
            if (amount > 1000) {
                addLog(`   ➜ case CreditCard when amount > 1000 → requiresVerification`);
                return {
                    status: 'REQUIRES_VERIFICATION',
                    message: 'High-value credit card transaction requires verification',
                    pattern: 'CreditCard with guard condition',
                    color: '#ffc107'
                };
            } else {
                addLog(`   ➜ case CreditCard → approved`);
                return {
                    status: 'APPROVED',
                    message: 'Credit card payment approved',
                    pattern: 'CreditCard standard processing',
                    color: '#28a745'
                };
            }

        case 'paypal':
            addLog(`   ➜ case PayPal → approved`);
            return {
                status: 'APPROVED',
                message: 'PayPal payment processed successfully',
                pattern: 'PayPal standard processing',
                color: '#28a745'
            };

        case 'bank':
            if (amount >= 5000) {
                addLog(`   ➜ case BankTransfer when amount >= 5000 → requiresApproval`);
                return {
                    status: 'REQUIRES_APPROVAL',
                    message: 'Large bank transfer requires manager approval',
                    pattern: 'BankTransfer with approval workflow',
                    color: '#dc3545'
                };
            } else {
                addLog(`   ➜ case BankTransfer → approved`);
                return {
                    status: 'APPROVED',
                    message: 'Bank transfer approved',
                    pattern: 'BankTransfer standard processing',
                    color: '#28a745'
                };
            }

        default:
            addLog(`   ➜ default case (should not happen with sealed types)`);
            return {
                status: 'ERROR',
                message: 'Unknown payment method',
                pattern: 'Default case (should not happen with sealed types)',
                color: '#dc3545'
            };
    }
}

/**
 * Show the processing result
 */
function showResult(result) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    // Create the result HTML
    resultContent.innerHTML = `
        <div style="border-left: 4px solid ${result.color}; padding-left: 15px;">
            <h4 style="color: ${result.color}; margin: 0 0 10px 0;">${result.status}</h4>
            <p style="margin: 0 0 10px 0; font-size: 16px;">${result.message}</p>
            <small style="color: #666; font-style: italic;">
                Java 21 Pattern: ${result.pattern}
            </small>
        </div>
    `;

    // Show the result section
    resultSection.style.display = 'block';

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Add a message to the API log
 */
function addLog(message) {
    const log = document.getElementById('api-log');
    const timestamp = new Date().toLocaleTimeString();

    // Create new log entry
    const logEntry = document.createElement('div');
    logEntry.innerHTML = `[${timestamp}] ${message}`;

    // Add to log
    log.appendChild(logEntry);

    // Auto-scroll to bottom
    log.scrollTop = log.scrollHeight;

    // Keep only last 20 entries to prevent memory issues
    while (log.children.length > 20) {
        log.removeChild(log.firstChild);
    }
}

/**
 * Clear the API log (utility function)
 */
function clearLog() {
    const log = document.getElementById('api-log');
    log.innerHTML = 'Log cleared...';
}

/**
 * Get current demo state (utility function for debugging)
 */
function getDemoState() {
    return {
        method: currentMethod,
        amount: currentAmount,
        timestamp: new Date().toISOString()
    };
}

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setAmount,
        processPayment,
        simulatePatternMatching,
        getDemoState
    };
}