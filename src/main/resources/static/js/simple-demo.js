/**
 * Enhanced Simple Payment Demo - JavaScript using Shared Visual Flow Inspector
 * UPDATED: Uses shared visual-flow-inspector.js instead of custom implementation
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;
let demoStartTime = Date.now();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Enhanced Simple Demo Initializing...');

    // UPDATED: Initialize shared Visual Flow Inspector in enhanced mode
    initializeEnhancedFlowInspector({
        showTimestamps: false,
        maxLogEntries: 15
    });

    initializeDemo();
});

/**
 * Initialize the enhanced demo
 */
function initializeDemo() {
    setupPaymentMethodSelection();
    setupAmountSelection();

    // UPDATED: Use shared clearInspectorLog and logAPIFlow
    clearInspectorLog();

    // UPDATED: Use standardized logAPIFlow format
    logAPIFlow('Initial Processing', 'Simple Payment Demo Load', 'Frontend');
    logAPIFlow('API Call', 'GET /api/simple-payment/1');
    logAPIFlow('Controller', 'SimplePaymentController.loadDemo');
    logAPIFlow('Service', 'Multiple methods called');
    logAPIFlow('Service Method', 'SimplePaymentService.initializeDemo()', 'Standard Demo API');
    logAPIFlow('Service Method', 'SimplePaymentService.loadPatterns()', 'Standard Demo API');
    logAPIFlow('Operation', 'Initial demo load: pattern matching + guard conditions using loadPatterns()/initializeDemo()');
    logAPIFlow('Feature', 'Sequenced Pattern Matching');

    console.log('✅ Enhanced demo ready');
}

/**
 * Setup payment method selection handlers
 */
function setupPaymentMethodSelection() {
    const paymentCards = document.querySelectorAll('.payment-method-card');

    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
}

/**
 * Setup amount button selection handlers
 */
function setupAmountSelection() {
    const amountButtons = document.querySelectorAll('.amount-btn');

    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

/**
 * Handle payment method selection with enhanced logging
 */
function selectPaymentMethod(selectedCard) {
    const method = selectedCard.dataset.method;

    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    selectedCard.classList.add('selected');

    // Update current method
    currentMethod = method;

    // UPDATED: Use shared logging functions
    logFlowSeparator('Payment Method Selection');
    logAPIFlow('Operation', `Selected ${getMethodDisplayName(method)} payment method`);
    logAPIFlow('Operation', `switch(method) case "${method}" -> ...`);
    logAPIFlow('Feature', 'Pattern matching switch expression ready');
    logAPIFlow('Operation', getPatternDescription(method));
}

/**
 * Set the payment amount with enhanced logging and guard condition analysis
 */
function setAmount(amount) {
    const previousAmount = currentAmount;
    currentAmount = amount;

    // Update display
    const amountElement = document.getElementById('current-amount');
    if (amountElement) {
        amountElement.textContent = `$${amount.toLocaleString()}`;
    }

    // UPDATED: Use shared logging functions
    logFlowSeparator('Amount Configuration');
    logAPIFlow('Operation', `Updated from $${previousAmount.toLocaleString()} to $${amount.toLocaleString()}`);

    const guardAnalysis = analyzeGuardConditions(currentMethod, amount);
    if (guardAnalysis.triggered) {
        logAPIFlow('Operation', `Guard condition: ${guardAnalysis.condition} = TRUE`);
        logAPIFlow('Operation', guardAnalysis.action);
    } else {
        logAPIFlow('Operation', 'No guard conditions will be triggered');
    }
}

/**
 * Process the payment with comprehensive API response handling
 */
function processPayment() {
    console.log('Processing payment...', { method: currentMethod, amount: currentAmount });

    // UPDATED: Use shared logging functions
    logFlowSeparator('Payment Processing Started');
    logAPIFlow('API Call', 'POST /api/simple-payment/process');
    logAPIFlow('Operation', `method: "${currentMethod}", amount: $${currentAmount.toLocaleString()}`);
    logAPIFlow('Operation', 'Measuring backend response time...');

    const processingStartTime = performance.now();

    const payload = {
        method: currentMethod,
        amount: currentAmount
    };

    fetch('/api/simple-payment/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        const processingTime = Math.round(performance.now() - processingStartTime);
        logAPIFlow('Operation', `HTTP ${response.status} in ${processingTime}ms`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const totalTime = Math.round(performance.now() - processingStartTime);
        console.log('Enhanced API response received:', data);

        // UPDATED: Use shared enhanced API response handling
        handleEnhancedApiResponse(data, totalTime);

        // Build result for display
        const result = {
            status: data.status,
            message: data.message,
            pattern: data.java21_feature || 'Pattern Matching',
            color: getStatusColor(data.status),
            processingTime: totalTime,
            patternMatched: data.pattern_matched,
            guardCondition: data.guard_condition,
            processingAction: data.processing_action,
            businessRule: data.business_rule_applied
        };

        showResult(result);
    })
    .catch(error => {
        console.error('Error:', error);

        // UPDATED: Use shared logging for errors
        logFlowSeparator('Processing Error');
        logAPIFlow('Operation', 'Could not connect to Spring Boot application');
        logAPIFlow('Operation', 'Verify application is running on localhost:8080');
        logAPIFlow('Operation', error.message);

        const result = {
            status: 'CONNECTION_ERROR',
            message: 'Failed to connect to the backend service. Please ensure the Spring Boot application is running.',
            pattern: 'N/A',
            color: '#ef4444',
            processingTime: 0
        };

        showResult(result);
    });
}

/**
 * Show the processing result with enhanced visualization
 */
function showResult(result) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    if (!resultSection || !resultContent) {
        console.error('Result elements not found!');
        return;
    }

    // Create enhanced result HTML
    resultContent.innerHTML = `
        <div class="d-flex align-items-start gap-3">
            <div class="flex-shrink-0">
                <div style="width: 50px; height: 50px; background: ${result.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                    ${getStatusIcon(result.status)}
                </div>
            </div>
            <div class="flex-grow-1">
                <h4 style="color: ${result.color}; margin: 0 0 10px 0;">${result.status}</h4>
                <p style="margin: 0 0 15px 0; font-size: 1.1rem; line-height: 1.4;">${result.message}</p>

                <div class="row g-3">
                    ${result.patternMatched ? `
                    <div class="col-md-6">
                        <strong>Pattern Matched:</strong><br>
                        <span class="text-muted">${result.patternMatched}</span>
                    </div>
                    ` : ''}

                    ${result.guardCondition && result.guardCondition !== 'none' ? `
                    <div class="col-md-6">
                        <strong>Guard Condition:</strong><br>
                        <span class="text-muted">${result.guardCondition}</span>
                    </div>
                    ` : ''}

                    ${result.processingAction ? `
                    <div class="col-md-6">
                        <strong>Processing Action:</strong><br>
                        <span class="text-muted">${result.processingAction}</span>
                    </div>
                    ` : ''}

                    <div class="col-md-6">
                        <strong>Processing Time:</strong><br>
                        <span class="text-muted">${result.processingTime}ms</span>
                    </div>
                </div>

                ${result.businessRule ? `
                <div class="mt-3 p-3" style="background: rgba(99, 102, 241, 0.1); border-radius: 8px; border-left: 4px solid #6366f1;">
                    <small><strong>Business Rule Applied:</strong><br>
                    ${result.businessRule}</small>
                </div>
                ` : ''}

                <div class="mt-3 p-3" style="background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 4px solid #10b981;">
                    <small><strong>Java 21 Feature:</strong> ${result.pattern}</small>
                </div>
            </div>
        </div>
    `;

    // Show the result section with animation
    resultSection.style.display = 'block';

    // UPDATED: Use shared logging for completion
    logAPIFlow('Operation', `Result displayed: ${result.status}`);

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ================================
   HELPER FUNCTIONS
   ================================ */

function analyzeGuardConditions(method, amount) {
    switch(method) {
        case 'creditcard':
            if (amount > 1000) {
                return {
                    triggered: true,
                    condition: 'amount > $1,000',
                    action: 'requireAdditionalVerification()',
                    description: 'High-value transaction - additional verification required'
                };
            }
            break;
        case 'bank':
            if (amount >= 5000) {
                return {
                    triggered: true,
                    condition: 'amount >= $5,000',
                    action: 'requireManagerApproval()',
                    description: 'Large bank transfer - manager approval needed'
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

function getMethodDisplayName(method) {
    const names = {
        'creditcard': 'Credit Card',
        'paypal': 'PayPal',
        'bank': 'Bank Transfer'
    };
    return names[method] || method;
}

function getPatternDescription(method) {
    const patterns = {
        'creditcard': 'CreditCard pattern with amount-based guard conditions',
        'paypal': 'PayPal pattern with standard processing logic',
        'bank': 'BankTransfer pattern with approval workflow routing'
    };
    return patterns[method] || 'Unknown pattern';
}

function getStatusColor(status) {
    if (status.includes('APPROVED')) return '#10b981';
    if (status.includes('REQUIRES')) return '#f59e0b';
    if (status.includes('ERROR')) return '#ef4444';
    return '#6366f1';
}

function getStatusIcon(status) {
    if (status.includes('APPROVED')) return '✓';
    if (status.includes('REQUIRES')) return '!';
    if (status.includes('ERROR')) return '✗';
    return '?';
}

/* ================================
   EXPORT FOR CONSOLE DEBUGGING
   ================================ */
window.DemoControls = {
    setAmount,
    selectPaymentMethodByName: (methodName) => {
        const card = document.querySelector(`[data-method="${methodName}"]`);
        if (card) selectPaymentMethod(card);
    },
    processPayment,
    currentState: () => ({ method: currentMethod, amount: currentAmount })
};

console.log('🚀 Enhanced Simple Demo with Shared Visual Flow Inspector loaded successfully');
console.log('🎮 Try: DemoControls.setAmount(1500) or clearInspectorLog()');