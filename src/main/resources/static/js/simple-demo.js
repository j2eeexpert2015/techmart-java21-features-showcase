/**
 * Simple Payment Demo - JavaScript
 * Location: src/main/resources/static/js/simple-demo.js
 * Full Page Layout with Right-Side API Log - BACKEND INTEGRATED VERSION
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing demo...'); // Debug log
    initializeDemo();
});

/**
 * Initialize the demo
 */
function initializeDemo() {
    console.log('Initializing demo...'); // Debug log
    setupPaymentMethodSelection();
    addLog('🚀 Simple Payment Demo initialized');
    addLog('Ready to demonstrate Java 21 Pattern Matching!');
    addLog('');
    addLog('Instructions:');
    addLog('1. Select a payment method on the left');
    addLog('2. Choose an amount');
    addLog('3. Click Process Payment');
    addLog('4. Watch the backend processing results!');
    addLog('');
}

/**
 * Setup payment method selection handlers
 */
function setupPaymentMethodSelection() {
    const paymentCards = document.querySelectorAll('.payment-card');
    console.log('Found payment cards:', paymentCards.length); // Debug log

    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Payment card clicked:', this.dataset.method); // Debug log
            selectPaymentMethod(this);
        });
    });
}

/**
 * Handle payment method selection
 */
function selectPaymentMethod(selectedCard) {
    console.log('Selecting payment method:', selectedCard.dataset.method); // Debug log

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
    console.log('Setting amount to:', amount); // Debug log
    currentAmount = amount;

    const amountElement = document.getElementById('current-amount');
    if (amountElement) {
        amountElement.textContent = `$${amount.toLocaleString()}`;
    }

    // Log with context
    addLog('─'.repeat(50));
    addLog(`💰 Amount set to: $${amount.toLocaleString()}`);
    addLog(`   This will ${getAmountContext(currentMethod, amount)}`);
}

/**
 * Process the payment (main demo function)
 */
function processPayment() {
    console.log('Processing payment...', { method: currentMethod, amount: currentAmount });

    addLog('');
    addLog('🟰'.repeat(25) + ' PROCESSING PAYMENT ' + '🟰'.repeat(25));
    addLog(`💳 Method: ${getMethodName(currentMethod)}`);
    addLog(`💵 Amount: $${currentAmount.toLocaleString()}`);
    addLog('🚀 Sending request to backend...');

    const payload = {
        method: currentMethod,
        amount: currentAmount
    };

    fetch('/api/simple/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        addLog('✅ BACKEND RESPONSE:');
        addLog(`   Status: ${data.status}`);
        addLog(`   Message: ${data.message}`);
        addLog(`   Java 21 Feature: ${data.java21_feature}`);
        addLog('');
        addLog('🎉 Backend processing complete!');

        const result = {
            status: data.status,
            message: data.message,
            pattern: data.java21_feature,
            color: data.status.includes('APPROVED') ? '#10b981' : (data.status.includes('ERROR') ? '#ef4444' : '#f59e0b')
        };
        showResult(result);
    })
    .catch(error => {
        console.error('Error:', error);
        addLog('❌ ERROR: Could not connect to the backend. Is the application running?');
        const result = {
            status: 'ERROR',
            message: 'Failed to connect to the backend service.',
            pattern: 'N/A',
            color: '#ef4444'
        };
        showResult(result);
    });
}


/**
 * Show the processing result
 */
function showResult(result) {
    console.log('Showing result:', result); // Debug log

    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    if (!resultSection || !resultContent) {
        console.error('Result elements not found!'); // Debug log
        return;
    }

    // Create the result HTML
    resultContent.innerHTML = `
        <div style="border-left: 4px solid ${result.color}; padding-left: 15px;">
            <h4 style="color: ${result.color}; margin: 0 0 10px 0;">${result.status}</h4>
            <p style="margin: 0 0 10px 0; font-size: 16px;">${result.message}</p>
            <small style="color: #666; font-style: italic;">
                Java 21 Feature: ${result.pattern}
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

    if (!log) {
        console.error('API log element not found!'); // Debug log
        console.log('Message would be:', message); // Fallback debug log
        return;
    }

    const timestamp = new Date().toLocaleTimeString();

    // Create new log entry
    const logEntry = document.createElement('div');
    logEntry.innerHTML = `[${timestamp}] ${message}`;

    // Add to log
    log.appendChild(logEntry);

    // Auto-scroll to bottom
    log.scrollTop = log.scrollHeight;
}

/**
 * Clear the API log (utility function)
 */
function clearLog() {
    const log = document.getElementById('api-log');
    if (log) {
        log.innerHTML = 'Log cleared...';
    }
}

/**
 * Get user-friendly method name
 */
function getMethodName(method) {
    const names = {
        'creditcard': 'Credit Card',
        'paypal': 'PayPal',
        'bank': 'Bank Transfer'
    };
    return names[method] || method;
}

/**
 * Get pattern description for educational purposes
 */
function getPatternDescription(method) {
    const patterns = {
        'creditcard': 'CreditCard(number, cvv, expiry) with guard conditions',
        'paypal': 'PayPal(email, verified) with business rules',
        'bank': 'BankTransfer(account, routing) with approval workflow'
    };
    return patterns[method] || 'Unknown pattern';
}

/**
 * Get amount context for user feedback
 */
function getAmountContext(method, amount) {
    if (method === 'creditcard' && amount > 1000) {
        return 'trigger the high-value guard condition';
    } else if (method === 'bank' && amount >= 5000) {
        return 'require manager approval for large transfer';
    } else {
        return 'use standard processing';
    }
}