/**
 * Enhanced Payment Processing Demo - JavaScript with Rich Visual Flow Inspector
 * UPDATED: Matches shopping cart demo's rich educational metadata display
 */

/* ================================
   DEMO CONFIGURATION AND STATE
   ================================ */
const PAYMENT_DEMO_CONFIG = {
    customerId: 1,
    baseUrl: '',
    orderAmount: 1500.00, // Default amount for demo
    highValueThreshold: 1000,
    largeTransferThreshold: 5000
};

const PaymentDemoState = {
    selectedPaymentMethod: 'creditcard',
    customerType: 'basic',
    isInternational: false,
    demoStartTime: Date.now()
};

/* ================================
   INITIALIZATION
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Enhanced Payment Processing Demo Initializing...');

    setupEventListeners();
    initializePaymentForm();
    simulateInitialPatternMatching();

    console.log('✅ Enhanced Payment Processing Demo Ready');
});

function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', handlePaymentMethodSelection);
    });

    // Customer type selection
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.addEventListener('change', handleCustomerTypeChange);
    });

    // Amount test buttons
    document.querySelectorAll('[onclick*="setAmount"]').forEach(button => {
        const amount = button.textContent.match(/\$?([\d,]+)/)?.[1];
        if (amount) {
            button.addEventListener('click', () => setAmount(parseInt(amount.replace(',', ''))));
        }
    });

    console.log('📋 Enhanced event listeners setup complete');
}

/* ================================
   PAYMENT METHOD SELECTION
   ================================ */
function handlePaymentMethodSelection(event) {
    event.preventDefault();
    const card = event.currentTarget;
    const paymentMethod = card.getAttribute('data-method');

    if (paymentMethod === PaymentDemoState.selectedPaymentMethod) {
        return; // Already selected
    }

    // Update UI selection
    updateSelectedPaymentMethod(paymentMethod);

    // Log selection with educational context
    logFlowSeparator('Payment Method Selection');
    logFlowEntry('👤 User Action', `Selected ${getPatternName(paymentMethod)} payment method`);
    logFlowEntry('🎯 Pattern Preview', `switch(paymentMethod) → case ${getPatternName(paymentMethod)}(...)`);
    logFlowEntry('🔥 Java 21 Feature', 'Pattern Matching for Switch Expression', 'java21');
    logFlowEntry('📊 Business Context', getPatternDescription(paymentMethod));

    // Show notification
    showNotification(`Selected ${getPatternName(paymentMethod)} - Pattern matching updated`, 'info');
}

function updateSelectedPaymentMethod(paymentMethod) {
    // Update card selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-method="${paymentMethod}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    PaymentDemoState.selectedPaymentMethod = paymentMethod;

    // Highlight corresponding API reference
    highlightPatternMatchingReference(paymentMethod);
}

/* ================================
   AMOUNT AND CUSTOMER SELECTION
   ================================ */
function setAmount(amount) {
    PAYMENT_DEMO_CONFIG.orderAmount = amount;

    // Update UI displays
    updateAmountDisplays(amount);

    // Enhanced logging with guard condition analysis
    logFlowSeparator('Amount Configuration');
    logFlowEntry('💰 Amount Updated', `Set to $${amount.toLocaleString()}`);

    const guardAnalysis = analyzeGuardConditions(PaymentDemoState.selectedPaymentMethod, amount);
    if (guardAnalysis.triggered) {
        logFlowEntry('⚡ Guard Condition', `${guardAnalysis.condition} = TRUE`, 'guard');
        logFlowEntry('🔀 Processing Route', guardAnalysis.action, 'warning');
        showNotification(`Guard condition triggered: ${guardAnalysis.condition}`, 'warning');
    } else {
        logFlowEntry('✅ Standard Processing', 'No guard conditions triggered');
    }
}

function handleCustomerTypeChange(event) {
    const newCustomerType = event.target.value;
    PaymentDemoState.customerType = newCustomerType;

    logFlowEntry('👤 Customer Tier', `Updated to ${newCustomerType.toUpperCase()}`);

    const tierMessages = {
        'basic': 'Standard processing rates apply',
        'premium': 'Reduced fees and priority support',
        'vip': 'Expedited processing and no fees'
    };

    showNotification(tierMessages[newCustomerType], 'info');
}

/* ================================
   MAIN PAYMENT PROCESSING
   ================================ */
async function processPayment() {
    console.log('Processing payment:', { method: PaymentDemoState.selectedPaymentMethod, amount: PAYMENT_DEMO_CONFIG.orderAmount });

    // Enhanced pre-processing logging (like shopping cart)
    logFlowSeparator('Payment Processing Started');
    logFlowEntry('🚀 API Request', 'POST /api/payment/process');
    logFlowEntry('📋 Request Payload', `method: "${mapPaymentType(PaymentDemoState.selectedPaymentMethod)}", amount: $${PAYMENT_DEMO_CONFIG.orderAmount.toLocaleString()}`);
    logFlowEntry('⏱️ Backend Call', 'Sending to Spring Boot application...');

    const processingStartTime = performance.now();

    try {
        const response = await fetch('/api/payment/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentType: mapPaymentType(PaymentDemoState.selectedPaymentMethod),
                amount: PAYMENT_DEMO_CONFIG.orderAmount,
                customerTier: PaymentDemoState.customerType.toUpperCase(),
                isInternational: PaymentDemoState.isInternational
            })
        });

        const processingTime = Math.round(performance.now() - processingStartTime);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        // Handle enhanced API response (like shopping cart)
        handleEnhancedPaymentResult(result, processingTime);

    } catch (error) {
        console.error('Payment processing error:', error);

        // Enhanced error logging
        logFlowSeparator('Processing Error');
        logFlowEntry('❌ Backend Error', 'Could not connect to Spring Boot application', 'error');
        logFlowEntry('🔧 Troubleshooting', 'Verify application is running on localhost:8080');

        showNotification('Failed to connect to backend. Is the Java application running?', 'danger');
    }
}

/* ================================
   ENHANCED API RESPONSE HANDLING (Like Shopping Cart)
   ================================ */
function handleEnhancedPaymentResult(result, processingTime) {
    logFlowSeparator('Backend Processing Complete');

    // === BASIC RESULT LOGGING ===
    logFlowEntry('✅ Processing Result', `Status: ${result.status}`);
    logFlowEntry('💬 Result Message', result.statusMessage || result.message);

    // === CONTROLLER & SERVICE METHOD TRACKING (Like Shopping Cart) ===
    if (result.controller_method) {
        logFlowEntry('🔴 Controller', result.controller_method);
    }
    if (result.service_method) {
        logFlowEntry('🟣 Service Layer', result.service_method);
    }

    // === JAVA 21 METHODS USED (Like Shopping Cart) ===
    if (result.java21_methods_used && result.java21_methods_used.length > 0) {
        logFlowEntry('🔥 Java 21 Methods', result.java21_methods_used.join(', '), 'java21');
    }

    // === PATTERN MATCHING DETAILS ===
    if (result.pattern_matched) {
        logFlowEntry('🎯 Pattern Matched', result.pattern_matched);
    }
    if (result.guard_condition && result.guard_condition !== 'none') {
        logFlowEntry('⚡ Guard Condition', result.guard_condition, 'guard');
    }
    if (result.processing_action) {
        logFlowEntry('🔄 Processing Action', result.processing_action);
    }

    // === BUSINESS LOGIC & EDUCATIONAL INFO ===
    if (result.business_rule_applied) {
        logFlowEntry('📋 Business Rule', result.business_rule_applied);
    }
    if (result.pattern_matching_path) {
        logFlowEntry('🗺️ Pattern Path', result.pattern_matching_path);
    }
    if (result.performance_benefit) {
        logFlowEntry('⚡ Performance', result.performance_benefit);
    }

    // === JAVA 21 FEATURE INFO ===
    if (result.java21_feature) {
        logFlowEntry('🔥 Java 21 Feature', result.java21_feature, 'java21');
    }

    // === TIMING & COMPLETION ===
    logFlowEntry('⏱️ Total Time', `${processingTime}ms end-to-end`);
    logFlowEntry('🎉 Demo Complete', `Payment processing demonstration finished`);

    // Show success notification
    const statusClass = result.successful ? 'success' :
                       result.requiresAdditionalAction ? 'warning' : 'danger';
    showNotification(`Payment ${result.status}: ${result.statusMessage || 'Processed'}`, statusClass);
}

/* ================================
   ENHANCED VISUAL FLOW INSPECTOR (Like Shopping Cart)
   ================================ */
function logFlowEntry(action, details, type = 'info') {
    const logContainer = document.getElementById('api-log');

    if (!logContainer) {
        console.warn('API log container not found');
        return;
    }

    // Clear initial message if present
    if (logContainer.querySelector('.text-muted')) {
        logContainer.innerHTML = '';
    }

    const logEntry = document.createElement('div');
    logEntry.className = 'api-flow-block';

    let iconColor = 'var(--info-color)';
    let specialTag = '';

    // Style based on type (like shopping cart)
    switch(type) {
        case 'java21':
            iconColor = 'var(--success-color)';
            specialTag = '<span class="java21-pattern-tag">Java 21</span>';
            break;
        case 'guard':
            iconColor = 'var(--warning-color)';
            specialTag = '<span class="java21-pattern-tag" style="background: var(--warning-color);">Guard</span>';
            break;
        case 'warning':
            iconColor = 'var(--warning-color)';
            break;
        case 'error':
            iconColor = 'var(--danger-color)';
            break;
    }

    // Build enhanced log entry (like shopping cart)
    logEntry.innerHTML = `
        <div style="border-left-color: ${iconColor}">
            <strong>${action}</strong> ${specialTag}
        </div>
        <div class="api-flow-child">📋 ${details}</div>
    `;

    // Insert at top (newest first)
    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Limit entries to prevent overflow
    while (logContainer.children.length > 12) {
        logContainer.removeChild(logContainer.lastChild);
    }

    // Auto-scroll to top
    logContainer.scrollTop = 0;
}

function logFlowSeparator(title) {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return;

    const separator = document.createElement('div');
    separator.className = 'pattern-flow-separator';
    separator.innerHTML = `
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 8px 0; position: relative; text-align: center;">
            <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #1e293b; padding: 0 12px; font-size: 9px; color: #f59e0b; font-weight: bold; border-radius: 12px;">
                ⚡ ${title} ⚡
            </div>
        </div>
    `;

    logContainer.insertBefore(separator, logContainer.firstChild);
}

function clearInspectorLog() {
    const logContainer = document.getElementById('api-log');
    if (logContainer) {
        logContainer.innerHTML = `
            <div class="text-muted text-center py-2">
                <i class="fas fa-mouse-pointer mb-2"></i><br>
                Select payment method and process to see Java 21 pattern matching...
            </div>
        `;
    }
    showNotification('Visual Flow Inspector cleared', 'info');
}

/* ================================
   PATTERN MATCHING REFERENCE HIGHLIGHTING
   ================================ */
function highlightPatternMatchingReference(paymentMethod) {
    // Clear previous highlights
    document.querySelectorAll('.api-reference-table tr').forEach(row => {
        row.classList.remove('pattern-highlight');
    });

    // Highlight relevant patterns based on method
    const rowsToHighlight = ['pattern-switch'];

    switch(paymentMethod) {
        case 'creditcard':
            rowsToHighlight.push('pattern-creditcard', 'pattern-guard');
            break;
        case 'paypal':
            rowsToHighlight.push('pattern-paypal');
            break;
        case 'banktransfer':
            rowsToHighlight.push('pattern-banktransfer');
            break;
    }

    // Always highlight sealed interface
    rowsToHighlight.push('pattern-sealed');

    // Apply highlights
    rowsToHighlight.forEach(rowId => {
        const row = document.getElementById(rowId);
        if (row) {
            row.classList.add('pattern-highlight');
        }
    });

    // Auto-remove highlights after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.pattern-highlight').forEach(row => {
            row.classList.remove('pattern-highlight');
        });
    }, 3000);
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */
function updateAmountDisplays(amount) {
    const totalElement = document.getElementById('order-total');
    const buttonAmountElement = document.getElementById('button-amount');

    if (totalElement) {
        totalElement.textContent = `$${amount.toLocaleString()}`;
    }
    if (buttonAmountElement) {
        buttonAmountElement.textContent = `$${amount.toLocaleString()}`;
    }
}

function analyzeGuardConditions(method, amount) {
    switch(method) {
        case 'creditcard':
            if (amount > PAYMENT_DEMO_CONFIG.highValueThreshold) {
                return {
                    triggered: true,
                    condition: `amount > $${PAYMENT_DEMO_CONFIG.highValueThreshold.toLocaleString()}`,
                    action: 'requireAdditionalVerification()',
                    description: 'High-value credit card transaction verification'
                };
            }
            break;
        case 'banktransfer':
            if (amount >= PAYMENT_DEMO_CONFIG.largeTransferThreshold) {
                return {
                    triggered: true,
                    condition: `amount >= $${PAYMENT_DEMO_CONFIG.largeTransferThreshold.toLocaleString()}`,
                    action: 'requireManagerApproval()',
                    description: 'Large bank transfer needs approval'
                };
            }
            break;
        case 'paypal':
            if (PaymentDemoState.customerType !== 'basic') {
                return {
                    triggered: true,
                    condition: 'isPremiumCustomer()',
                    action: 'processExpedited()',
                    description: 'Premium customer expedited processing'
                };
            }
            break;
    }

    return {
        triggered: false,
        condition: 'none',
        action: 'processStandard()',
        description: 'Standard processing path'
    };
}

function getPatternName(method) {
    const names = {
        'creditcard': 'CreditCard',
        'paypal': 'PayPal',
        'banktransfer': 'BankTransfer'
    };
    return names[method] || method;
}

function getPatternDescription(method) {
    const patterns = {
        'creditcard': 'Credit card pattern with amount-based guard conditions and international handling',
        'paypal': 'PayPal pattern with customer tier evaluation and account verification',
        'banktransfer': 'Bank transfer pattern with approval workflow and routing validation'
    };
    return patterns[method] || 'Payment method pattern';
}

function mapPaymentType(method) {
    const mapping = {
        'creditcard': 'CREDIT_CARD',
        'paypal': 'PAYPAL',
        'banktransfer': 'BANK_TRANSFER'
    };
    return mapping[method] || method.toUpperCase();
}

function showNotification(message, type = 'info') {
    console.log(`📢 Notification (${type}): ${message}`);

    // You can implement toast notifications here if needed
    // For now, just log to console
}

/* ================================
   INITIALIZATION FUNCTIONS
   ================================ */
function initializePaymentForm() {
    // Set default values
    updateSelectedPaymentMethod('creditcard');
    PaymentDemoState.customerType = 'basic';

    console.log('💳 Enhanced payment form initialized');
}

function simulateInitialPatternMatching() {
    setTimeout(() => {
        logFlowEntry('🎯 Demo Initialized', 'Payment pattern matching demonstration ready');
        logFlowEntry('💡 Instructions', 'Select payment method → Choose amount → Process payment');
        logFlowEntry('🔥 Java 21 Ready', 'Pattern Matching, Record Patterns, Guard Conditions', 'java21');
    }, 500);
}

/* ================================
   EXPORT FOR TESTING
   ================================ */
window.PaymentProcessingDemo = {
    config: PAYMENT_DEMO_CONFIG,
    state: PaymentDemoState,
    processPayment,
    clearInspectorLog,
    setAmount,
    handleCustomerTypeChange
};

console.log('🚀 Enhanced Payment Processing Demo JavaScript loaded successfully');
console.log('🎯 Rich Visual Flow Inspector matching shopping cart demo quality');