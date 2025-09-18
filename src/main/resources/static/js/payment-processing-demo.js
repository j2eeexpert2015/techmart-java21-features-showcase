/**
 * Enhanced Payment Processing Demo - JavaScript using Shared Visual Flow Inspector
 * UPDATED: Uses shared visual-flow-inspector.js instead of custom implementation
 */

/* ================================
   DEMO CONFIGURATION AND STATE
   ================================ */
const PAYMENT_DEMO_CONFIG = {
    customerId: 1,
    baseUrl: '',
    orderAmount: 1500.00,
    originalAmount: 1500.00,
    highValueThreshold: 1000,
    largeTransferThreshold: 5000
};

const PaymentDemoState = {
    selectedPaymentMethod: 'creditcard',
    customerType: 'basic',
    isInternational: false,
    instructionsVisible: true,
    tooltipsInitialized: false,
    scenarioRunning: false,
    demoStartTime: Date.now()
};

/* ================================
   INITIALIZATION
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Enhanced Payment Processing Demo Initializing...');

    // UPDATED: Initialize shared Visual Flow Inspector in enhanced mode
    initializeEnhancedFlowInspector({
        showTimestamps: false,
        maxLogEntries: 12
    });

    setupEventListeners();
    initializeTooltips();
    updatePatternMatching();
    setupUIGuidance();

    // UPDATED: Use shared logAPIFlow instead of custom logging
    logAPIFlow('Initial Processing', 'Enhanced Payment Processing Demo ready', 'Frontend');
    logAPIFlow('Feature', 'Java 21 Pattern Matching, Record Patterns, Guard Conditions');

    console.log('✅ Enhanced Payment Processing Demo Ready');
});

/* ================================
   EVENT LISTENERS
   ================================ */
function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', handlePaymentMethodSelection);
    });

    // Customer type change
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.addEventListener('change', handleCustomerTypeChange);
    });

    // International card toggle
    const internationalToggle = document.getElementById('international-card');
    if (internationalToggle) {
        internationalToggle.addEventListener('change', handleInternationalToggle);
    }
}

function setupUIGuidance() {
    initializeTooltips();
}

function initializeTooltips() {
    if (PaymentDemoState.tooltipsInitialized) return;

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    PaymentDemoState.tooltipsInitialized = true;
}

/* ================================
   PAYMENT METHOD SELECTION
   ================================ */
function handlePaymentMethodSelection(event) {
    event.preventDefault();
    const card = event.currentTarget;
    const paymentMethod = card.getAttribute('data-method');

    if (paymentMethod === PaymentDemoState.selectedPaymentMethod) {
        return;
    }

    updateSelectedPaymentMethod(paymentMethod);
    updatePatternMatching();
    highlightPattern(paymentMethod);

    // UPDATED: Use shared logging functions
    logFlowSeparator('Payment Method Selection');
    logAPIFlow('Operation', `${getPatternName(paymentMethod)} pattern activated`);
    logAPIFlow('Operation', `switch(payment) → case ${getPatternName(paymentMethod)}(...)`);
    logAPIFlow('Feature', 'Pattern Matching for Switch');

    showNotification(`Selected ${getPatternName(paymentMethod)} - Pattern matching updated`, 'info');
}

function updateSelectedPaymentMethod(paymentMethod) {
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-method="${paymentMethod}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    PaymentDemoState.selectedPaymentMethod = paymentMethod;
}

/* ================================
   CUSTOMER TYPE & INTERNATIONAL HANDLING
   ================================ */
function handleCustomerTypeChange(event) {
    const newCustomerType = event.target.value;
    PaymentDemoState.customerType = newCustomerType;

    updatePatternMatching();
    logAPIFlow('Operation', `Customer Type Changed: Now ${newCustomerType.toUpperCase()}`);

    const tierMessages = {
        'basic': 'Basic customer - standard processing rates apply',
        'premium': 'Premium customer - reduced fees and priority support',
        'vip': 'VIP customer - expedited processing and no fees'
    };

    showNotification(tierMessages[newCustomerType], 'info');
}

function handleInternationalToggle(event) {
    PaymentDemoState.isInternational = event.target.checked;
    updatePatternMatching();

    logAPIFlow('Operation', `International Status: ${PaymentDemoState.isInternational ? 'International Card' : 'Domestic Card'}`);

    const message = PaymentDemoState.isInternational
        ? 'International card - additional fees may apply for high-value transactions'
        : 'Domestic card - standard processing applies';

    showNotification(message, 'info');
}

/* ================================
   AMOUNT HANDLING
   ================================ */
function setAmount(amount) {
    const previousAmount = PAYMENT_DEMO_CONFIG.orderAmount;
    PAYMENT_DEMO_CONFIG.orderAmount = amount;

    updateAmountDisplays(amount);
    updatePatternMatching();

    // UPDATED: Use shared logging with guard analysis
    logFlowSeparator('Amount Configuration');
    logAPIFlow('Operation', `Testing with $${amount.toLocaleString()}`);

    const guardAnalysis = analyzeGuardConditions();
    if (guardAnalysis.triggered) {
        logAPIFlow('Operation', `Guard Condition: ${guardAnalysis.description}`);
    }

    showNotification(`Testing with amount: $${amount.toLocaleString()} - Watch for guard condition changes!`, 'warning');
}

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

/* ================================
   PATTERN MATCHING PREVIEW
   ================================ */
function updatePatternMatching() {
    const statusContainer = document.getElementById('pattern-status');
    const guardCondition = analyzeGuardConditions();

    let statusHtml = `
        <div class="status-step">
            <div class="status-icon status-complete">
                <i class="fas fa-check"></i>
            </div>
            <div>
                <div><strong>Payment Method</strong></div>
                <small class="text-muted">${getPatternName(PaymentDemoState.selectedPaymentMethod)} pattern detected</small>
            </div>
        </div>
    `;

    if (guardCondition.triggered) {
        statusHtml += `
            <div class="status-step status-highlighted">
                <div class="status-icon status-active">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div>
                    <div><strong>Guard Condition</strong></div>
                    <small class="text-muted">${guardCondition.description}</small>
                </div>
            </div>
        `;
    } else {
        statusHtml += `
            <div class="status-step">
                <div class="status-icon status-complete">
                    <i class="fas fa-check"></i>
                </div>
                <div>
                    <div><strong>Standard Processing</strong></div>
                    <small class="text-muted">No guard conditions triggered</small>
                </div>
            </div>
        `;
    }

    statusHtml += `
        <div class="status-step">
            <div class="status-icon status-pending">
                <i class="fas fa-clock"></i>
            </div>
            <div>
                <div><strong>Ready to Process</strong></div>
                <small class="text-muted">Click process to execute pattern matching</small>
            </div>
        </div>
    `;

    statusContainer.innerHTML = statusHtml;
}

function analyzeGuardConditions() {
    const amount = PAYMENT_DEMO_CONFIG.orderAmount;
    const method = PaymentDemoState.selectedPaymentMethod;
    const customerType = PaymentDemoState.customerType;
    const isInternational = PaymentDemoState.isInternational;

    if (method === 'creditcard' && amount > 1000 && isInternational) {
        return {
            triggered: true,
            description: 'amount > $1000 && isInternational - verification required'
        };
    }
    if (method === 'creditcard' && amount > 1000) {
        return {
            triggered: true,
            description: 'amount > $1000 - enhanced security processing'
        };
    }
    if (method === 'paypal' && customerType !== 'basic') {
        return {
            triggered: true,
            description: 'isPremiumCustomer - expedited processing'
        };
    }
    if (method === 'banktransfer' && amount >= 5000) {
        return {
            triggered: true,
            description: 'amount >= $5000 - manager approval required'
        };
    }
    return { triggered: false, description: 'Standard processing' };
}

/* ================================
   MAIN PAYMENT PROCESSING
   ================================ */
async function processPayment() {
    // UPDATED: Use shared logging functions
    logFlowSeparator('Payment Processing Started');
    logAPIFlow('API Call', 'POST /api/payment/process');
    logAPIFlow('Operation', `Method: ${PaymentDemoState.selectedPaymentMethod}, Amount: $${PAYMENT_DEMO_CONFIG.orderAmount}, Customer: ${PaymentDemoState.customerType}`);
    logAPIFlow('Operation', 'Sending request to Spring Boot...');

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

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        // UPDATED: Use shared enhanced API response handling
        handleEnhancedApiResponse(result, 0);

    } catch (error) {
        console.error('Payment processing error:', error);

        // UPDATED: Use shared logging for errors
        logFlowSeparator('Processing Error');
        logAPIFlow('Operation', 'Could not connect to Spring Boot application');
        logAPIFlow('Operation', 'Ensure application running on :8080');

        showNotification('Failed to connect to backend. Is the Java application running?', 'danger');
    }
}

/* ================================
   PATTERN HIGHLIGHTING
   ================================ */
function highlightPattern(method) {
    // Clear previous highlights
    document.querySelectorAll('.api-reference-table tr').forEach(row => {
        row.classList.remove('pattern-highlight');
    });

    // Highlight relevant patterns
    document.getElementById('pattern-switch').classList.add('pattern-highlight');
    document.getElementById(`pattern-${method}`).classList.add('pattern-highlight');

    if (analyzeGuardConditions().triggered) {
        document.getElementById('pattern-guard').classList.add('pattern-highlight');
    }

    // Auto-remove highlights after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.pattern-highlight').forEach(row => {
            row.classList.remove('pattern-highlight');
        });
    }, 3000);
}

/* ================================
   DEMO SCENARIOS
   ================================ */
function resetDemo() {
    PaymentDemoState.selectedPaymentMethod = 'creditcard';
    PaymentDemoState.customerType = 'basic';
    PaymentDemoState.isInternational = false;

    PAYMENT_DEMO_CONFIG.orderAmount = PAYMENT_DEMO_CONFIG.originalAmount;
    updateAmountDisplays(PAYMENT_DEMO_CONFIG.originalAmount);

    document.getElementById('customer-basic').checked = true;
    document.getElementById('international-card').checked = false;

    updateSelectedPaymentMethod('creditcard');
    updatePatternMatching();
    clearInspectorLog();

    logAPIFlow('Operation', 'Demo Reset - All settings restored to defaults');
    showNotification('Demo reset to initial state', 'success');
}

function showDemoScenarios() {
    const modal = new bootstrap.Modal(document.getElementById('scenariosModal'));
    modal.show();
}

function showFlowHelp() {
    const helpText = `
    <strong>Visual Flow Inspector Guide:</strong><br>
    🎯 Shows real-time pattern matching decisions<br>
    📊 Tracks guard condition evaluations<br>
    🔄 Displays processing flow steps<br>
    <span class="java21-pattern-tag">Java 21</span> tags highlight new language features
    `;
    showNotification(helpText, 'info');
}

async function runScenario(scenarioType) {
    if (PaymentDemoState.scenarioRunning) {
        showNotification('Please wait for current scenario to complete', 'warning');
        return;
    }

    PaymentDemoState.scenarioRunning = true;
    const modal = bootstrap.Modal.getInstance(document.getElementById('scenariosModal'));
    if (modal) modal.hide();

    showNotification(`Running scenario: ${getScenarioName(scenarioType)}`, 'info');

    try {
        switch (scenarioType) {
            case 'high-value-international':
                await runHighValueInternationalScenario();
                break;
            case 'premium-paypal':
                await runPremiumPayPalScenario();
                break;
            case 'large-bank-transfer':
                await runLargeBankTransferScenario();
                break;
            case 'all-patterns':
                await runAllPatternsScenario();
                break;
        }
    } catch (error) {
        console.error('Scenario error:', error);
        showNotification('Scenario encountered an error', 'danger');
    } finally {
        PaymentDemoState.scenarioRunning = false;
    }
}

async function runHighValueInternationalScenario() {
    logFlowSeparator('Scenario: High-Value International Transaction');

    await delay(500);
    setAmount(1500);

    await delay(1000);
    updateSelectedPaymentMethod('creditcard');

    await delay(1000);
    const internationalToggle = document.getElementById('international-card');
    if (internationalToggle) {
        internationalToggle.checked = true;
        handleInternationalToggle({ target: internationalToggle });
    }

    await delay(1500);
    logAPIFlow('Operation', 'Complex guard condition: amount > $1000 && isInternational');
    showNotification('✅ High-value international transaction requires additional verification!', 'warning');
}

async function runPremiumPayPalScenario() {
    logFlowSeparator('Scenario: Premium Customer PayPal Processing');

    await delay(500);
    document.getElementById('customer-premium').checked = true;
    handleCustomerTypeChange({ target: document.getElementById('customer-premium') });

    await delay(1000);
    updateSelectedPaymentMethod('paypal');

    await delay(1500);
    logAPIFlow('Operation', 'Premium customer gets expedited PayPal processing');
    showNotification('✅ Premium customer qualifies for expedited PayPal processing!', 'success');
}

async function runLargeBankTransferScenario() {
    logFlowSeparator('Scenario: Large Bank Transfer with Manager Approval');

    await delay(500);
    setAmount(6000);

    await delay(1000);
    updateSelectedPaymentMethod('banktransfer');

    await delay(1500);
    logAPIFlow('Operation', 'Large transfer requires manager approval: amount >= $5000');
    showNotification('✅ Large bank transfer requires manager approval!', 'warning');
}

async function runAllPatternsScenario() {
    logFlowSeparator('Scenario: Testing All Payment Method Patterns');

    const methods = ['creditcard', 'paypal', 'banktransfer'];

    for (let i = 0; i < methods.length; i++) {
        const method = methods[i];

        await delay(1000);
        updateSelectedPaymentMethod(method);

        await delay(500);
        logAPIFlow('Operation', `${getPatternName(method)} pattern matched successfully`);
    }

    showNotification('✅ All payment method patterns tested successfully!', 'success');
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */
function getPatternName(method) {
    const names = {
        'creditcard': 'CreditCard',
        'paypal': 'PayPal',
        'banktransfer': 'BankTransfer'
    };
    return names[method] || method;
}

function mapPaymentType(method) {
    const mapping = {
        'creditcard': 'CREDIT_CARD',
        'paypal': 'PAYPAL',
        'banktransfer': 'BANK_TRANSFER'
    };
    return mapping[method] || method.toUpperCase();
}

function getScenarioName(scenarioType) {
    const names = {
        'high-value-international': 'High-Value International Transaction',
        'premium-paypal': 'Premium Customer PayPal',
        'large-bank-transfer': 'Large Bank Transfer',
        'all-patterns': 'Test All Patterns'
    };
    return names[scenarioType] || scenarioType;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// UPDATED: Override shared notification function with demo-specific implementation
function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.minWidth = '300px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';

    const icons = {
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'danger': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };

    notification.innerHTML = `
        <i class="${icons[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, type === 'danger' ? 8000 : 5000);

    console.log(`📢 Notification (${type}): ${message}`);
}

/* ================================
   EXPORT FOR TESTING
   ================================ */
window.PaymentProcessingDemo = {
    config: PAYMENT_DEMO_CONFIG,
    state: PaymentDemoState,
    processPayment,
    setAmount,
    resetDemo,
    runScenario,
    showDemoScenarios
};

console.log('🚀 Enhanced Payment Processing Demo with Shared Visual Flow Inspector loaded successfully');