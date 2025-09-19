/**
 * Payment Processing Demo - Complete JavaScript Implementation
 * Java 21 Pattern Matching for Switch with Sealed Payment Hierarchy
 */

// Global state
let selectedPaymentMethod = 'creditcard';
let selectedCustomerType = 'basic';
let currentAmount = 3996.00;
let isInternationalCard = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment Processing Demo initializing...');
    initializeDemo();
});

/**
 * Initialize the demo with event handlers and default state
 */
function initializeDemo() {
    setupPaymentMethodSelection();
    setupCustomerTypeSelection();
    setupInternationalCardToggle();
    setupQuickAmountButtons();
    setupInstructions();

    // Initialize tooltips
    initializeTooltips();

    console.log('Payment Processing Demo ready');
}

/**
 * Setup payment method selection
 */
function setupPaymentMethodSelection() {
    const paymentCards = document.querySelectorAll('.payment-method-card');
    const radioButtons = document.querySelectorAll('input[name="paymentMethod"]');

    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const card = this.closest('.payment-method-card');
                selectPaymentMethod(card);
            }
        });
    });
}

/**
 * Handle payment method selection
 */
function selectPaymentMethod(selectedCard) {
    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class and update radio
    selectedCard.classList.add('selected');
    const radio = selectedCard.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
        selectedPaymentMethod = radio.value;
    }

    // Update dynamic form
    updatePaymentForm(selectedPaymentMethod);

    // Update API reference highlighting
    highlightApiReference(selectedPaymentMethod);

    // Update pattern matching logic display
    updatePatternMatchingLogic(selectedPaymentMethod);

    console.log('Selected payment method:', selectedPaymentMethod);
}

/**
 * Setup customer type selection
 */
function setupCustomerTypeSelection() {
    const customerButtons = document.querySelectorAll('input[name="customerType"]');

    customerButtons.forEach(button => {
        button.addEventListener('change', function() {
            if (this.checked) {
                selectedCustomerType = this.value;
                updatePatternMatchingLogic(selectedPaymentMethod);
                console.log('Selected customer type:', selectedCustomerType);
            }
        });
    });
}

/**
 * Setup international card toggle
 */
function setupInternationalCardToggle() {
    const internationalToggle = document.getElementById('international-card');
    if (internationalToggle) {
        internationalToggle.addEventListener('change', function() {
            isInternationalCard = this.checked;
            updateGuardConditionWarning();
            updatePatternMatchingLogic(selectedPaymentMethod);
            console.log('International card:', isInternationalCard);
        });
    }
}

/**
 * Setup quick amount test buttons
 */
function setupQuickAmountButtons() {
    // Amount test buttons are handled by onclick attributes in HTML
    // Just update the display
    updateAmountDisplay();
}

/**
 * Setup demo instructions toggle
 */
function setupInstructions() {
    // Instructions toggle functionality if needed
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * MAIN PAYMENT PROCESSING FUNCTION
 * Updated to use shopping cart Visual Flow Inspector style
 */
function processPayment() {
    console.log('🔥 Processing payment...');

    // Show processing state
    showProcessingState();

    // Clear previous results
    clearApiLog();

    // Start logging using shopping cart style
    const logId = logProcessingStart();

    const processingStartTime = performance.now();

    // Build payment payload
    const payload = buildPaymentPayload();

    console.log('Sending payload to backend:', payload);

    // Make API call to Spring Boot backend
    fetch('/api/payment/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        const processingTime = Math.round(performance.now() - processingStartTime);
        console.log('Response received:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const totalTime = Math.round(performance.now() - processingStartTime);
        console.log('Payment processing result:', data);

        // Handle successful response using shopping cart style
        handleSuccessfulPayment(data, totalTime);
    })
    .catch(error => {
        console.error('Payment processing error:', error);
        handlePaymentError(error);
    })
    .finally(() => {
        hideProcessingState();
    });
}

/**
 * Build payment payload for the backend
 */
function buildPaymentPayload() {
    const basePayload = {
        paymentType: mapPaymentTypeForBackend(selectedPaymentMethod),
        amount: currentAmount,
        customerTier: selectedCustomerType.toUpperCase(),
        isInternational: isInternationalCard
    };

    // Add payment method specific fields
    switch (selectedPaymentMethod) {
        case 'creditcard':
            return {
                ...basePayload,
                cardNumber: getFormValue('card-number', '4111111111111111'),
                cardType: 'VISA',
                cvv: getFormValue('card-cvv', '123'),
                expiryMonth: getFormValue('expiry-month', '12'),
                expiryYear: getFormValue('expiry-year', '2026'),
                cardholderName: 'Demo User'
            };

        case 'paypal':
            return {
                ...basePayload,
                email: 'demo@example.com'
            };

        case 'banktransfer':
            return {
                ...basePayload,
                accountNumber: '1234567890',
                routingNumber: '021000021',
                bankName: 'Demo Bank',
                accountHolderName: 'Demo User'
            };

        default:
            return basePayload;
    }
}

/**
 * Handle successful payment response
 */
function handleSuccessfulPayment(data, totalTime) {
    // Log comprehensive backend response
    logBackendResponse(data, totalTime);

    // Update API reference highlighting based on patterns used
    if (data.java21_methods_used) {
        data.java21_methods_used.forEach(method => {
            highlightApiReferenceRow(method);
        });
    }

    // Update pattern matching logic display
    updatePatternMatchingResult(data);

    // Show success notification
    showSuccessNotification(data);

    // Update processing status
    updateProcessingStatusComplete(data);
}

/**
 * Handle payment processing errors
 */
function handlePaymentError(error) {
    console.error('Payment failed:', error);

    logError(error.message);

    // Show error notification
    showErrorNotification(error.message);

    // Update processing status to show error
    updateProcessingStatusError();
}

/**
 * Test payment with specific amount (called by quick test buttons)
 */
function testWithAmount(amount) {
    console.log(`Testing with amount: $${amount}`);

    // Update current amount
    currentAmount = amount;
    updateAmountDisplay();

    // Update guard condition analysis
    updateGuardConditionWarning();

    // Show what will happen with this amount
    analyzeAmountImpact(amount);

    // Trigger processing after short delay
    setTimeout(() => {
        processPayment();
    }, 500);
}

/**
 * Reset demo to initial state
 */
function resetDemo() {
    console.log('Resetting demo...');

    // Reset global state
    selectedPaymentMethod = 'creditcard';
    selectedCustomerType = 'basic';
    currentAmount = 3996.00;
    isInternationalCard = false;

    // Reset UI
    resetPaymentMethodSelection();
    resetCustomerTypeSelection();
    resetInternationalToggle();
    updateAmountDisplay();

    // Clear logs and status
    clearApiLog();
    resetProcessingStatus();
    hideGuardConditionWarning();

    showInfoNotification('Demo reset to initial state');
}

/**
 * Show demo scenarios modal
 */
function showDemoScenarios() {
    const modal = document.getElementById('scenariosModal');
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

/**
 * Run specific demo scenario
 */
function runScenario(scenarioName) {
    console.log('Running scenario:', scenarioName);

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('scenariosModal'));
    if (modal) modal.hide();

    // Reset first
    resetDemo();

    // Configure scenario
    switch (scenarioName) {
        case 'high-value-international':
            setupHighValueInternationalScenario();
            break;
        case 'premium-paypal':
            setupPremiumPayPalScenario();
            break;
        case 'large-bank-transfer':
            setupLargeBankTransferScenario();
            break;
        case 'all-patterns':
            runAllPatternsScenario();
            return; // This one doesn't process immediately
    }

    // Process after setup
    setTimeout(() => {
        processPayment();
    }, 1000);
}

/**
 * Toggle instructions panel visibility
 */
function toggleInstructions() {
    const panel = document.querySelector('.demo-instructions-panel');
    const button = panel.querySelector('button');

    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide';
    } else {
        panel.style.display = 'none';
        button.innerHTML = '<i class="fas fa-eye"></i> Show Instructions';
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Update dynamic payment form based on selected method
 */
function updatePaymentForm(method) {
    const formContainer = document.getElementById('payment-form');
    if (!formContainer) return;

    let formHtml = '';
    let patternInfo = '';

    switch (method) {
        case 'creditcard':
            patternInfo = 'Pattern: CreditCard(number, type, cvv, ...)';
            formHtml = `
                <h6><i class="fas fa-credit-card text-primary"></i> Credit Card Details
                    <span class="pattern-matching-indicator ms-2">Pattern: CreditCard</span>
                </h6>
                <div class="row">
                    <div class="col-md-8">
                        <label class="form-label">Card Number</label>
                        <input type="text" class="form-control" placeholder="1234 5678 9012 3456" id="card-number">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" placeholder="123" maxlength="4" id="card-cvv">
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <label class="form-label">Expiry Month</label>
                        <select class="form-control" id="expiry-month">
                            <option value="">Select Month</option>
                            <option value="01">01 - January</option>
                            <option value="12" selected>12 - December</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Expiry Year</label>
                        <select class="form-control" id="expiry-year">
                            <option value="">Select Year</option>
                            <option value="2025">2025</option>
                            <option value="2026" selected>2026</option>
                        </select>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="international-card" ${isInternationalCard ? 'checked' : ''}>
                        <label class="form-check-label" for="international-card">
                            International Card (triggers additional guard conditions)
                        </label>
                    </div>
                </div>`;
            break;

        case 'paypal':
            patternInfo = 'Pattern: PayPal(email, accountId, verified)';
            formHtml = `
                <h6><i class="fab fa-paypal text-primary"></i> PayPal Details
                    <span class="pattern-matching-indicator ms-2">Pattern: PayPal</span>
                </h6>
                <div class="mb-3">
                    <label class="form-label">PayPal Email</label>
                    <input type="email" class="form-control" placeholder="your-email@example.com" value="demo@example.com">
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" checked disabled>
                    <label class="form-check-label">Account Verified</label>
                </div>`;
            break;

        case 'banktransfer':
            patternInfo = 'Pattern: BankTransfer(account, routing, bank)';
            formHtml = `
                <h6><i class="fas fa-university text-primary"></i> Bank Transfer Details
                    <span class="pattern-matching-indicator ms-2">Pattern: BankTransfer</span>
                </h6>
                <div class="row">
                    <div class="col-md-8">
                        <label class="form-label">Account Number</label>
                        <input type="text" class="form-control" placeholder="1234567890">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Routing Number</label>
                        <input type="text" class="form-control" placeholder="021000021">
                    </div>
                </div>
                <div class="mt-3">
                    <label class="form-label">Bank Name</label>
                    <input type="text" class="form-control" placeholder="Your Bank Name" value="Demo Bank">
                </div>`;
            break;
    }

    formContainer.innerHTML = formHtml;

    // Re-setup event handlers for new form elements
    if (method === 'creditcard') {
        setupInternationalCardToggle();
    }
}

/**
 * Update API reference table highlighting
 */
function highlightApiReference(method) {
    // Clear previous highlights
    document.querySelectorAll('.api-reference-table tr').forEach(row => {
        row.classList.remove('pattern-highlight');
    });

    // Highlight relevant patterns
    const patterns = {
        'creditcard': ['pattern-switch', 'pattern-creditcard', 'pattern-guard'],
        'paypal': ['pattern-switch', 'pattern-paypal', 'pattern-sealed'],
        'banktransfer': ['pattern-switch', 'pattern-banktransfer', 'pattern-guard']
    };

    if (patterns[method]) {
        patterns[method].forEach(patternId => {
            const row = document.getElementById(patternId);
            if (row) {
                row.classList.add('pattern-highlight');
            }
        });
    }
}

/**
 * Highlight specific API reference row
 */
function highlightApiReferenceRow(methodName) {
    // This would highlight specific rows based on Java 21 methods used
    console.log('Highlighting API reference for:', methodName);
}

/**
 * Update pattern matching logic display
 */
function updatePatternMatchingLogic(method) {
    const statusContainer = document.getElementById('pattern-status');
    if (!statusContainer) return;

    // Update the pattern matching status steps
    updateProcessingStatusSteps(method);
}

/**
 * Update processing status steps
 */
function updateProcessingStatusSteps(method) {
    const steps = document.querySelectorAll('.status-step');

    // Reset all steps to pending
    steps.forEach(step => {
        const icon = step.querySelector('.status-icon');
        icon.className = 'status-icon status-pending';
        icon.innerHTML = '<i class="fas fa-clock"></i>';
    });

    // Update first step (pattern detection) as complete
    if (steps[0]) {
        const icon = steps[0].querySelector('.status-icon');
        icon.className = 'status-icon status-complete';
        icon.innerHTML = '<i class="fas fa-check"></i>';

        const text = steps[0].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Payment Method Detection</strong></div>
            <small class="text-muted">Pattern: ${getMethodDisplayName(method)} identified</small>
        `;
    }

    // Update second step based on guard conditions
    if (steps[1]) {
        const guardAnalysis = analyzeGuardConditions(method);
        const text = steps[1].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Guard Condition Check</strong></div>
            <small class="text-muted">${guardAnalysis.description}</small>
        `;
    }
}

/**
 * Analyze guard conditions for current configuration
 */
function analyzeGuardConditions(method) {
    const amount = currentAmount;
    const isInternational = isInternationalCard;
    const customerTier = selectedCustomerType;

    switch (method) {
        case 'creditcard':
            if (amount > 1000 && isInternational) {
                return {
                    triggered: true,
                    condition: 'amount > $1,000 && isInternational',
                    action: 'requireAdditionalVerification',
                    description: 'High-value international → Additional verification'
                };
            } else if (amount > 1000) {
                return {
                    triggered: true,
                    condition: 'amount > $1,000',
                    action: 'processHighValue',
                    description: 'High-value domestic → Enhanced processing'
                };
            }
            break;

        case 'paypal':
            if (customerTier === 'premium' || customerTier === 'vip') {
                return {
                    triggered: true,
                    condition: 'customer.isPremium()',
                    action: 'processExpedited',
                    description: 'Premium customer → Expedited processing'
                };
            }
            break;

        case 'banktransfer':
            if (amount >= 5000) {
                return {
                    triggered: true,
                    condition: 'amount >= $5,000',
                    action: 'requireManagerApproval',
                    description: 'Large transfer → Manager approval required'
                };
            }
            break;
    }

    return {
        triggered: false,
        condition: 'none',
        action: 'processStandard',
        description: 'No guard conditions triggered → Standard processing'
    };
}

/**
 * Update guard condition warning display
 */
function updateGuardConditionWarning() {
    const warning = document.getElementById('guard-condition-warning');
    if (!warning) return;

    const guardAnalysis = analyzeGuardConditions(selectedPaymentMethod);

    if (guardAnalysis.triggered && selectedPaymentMethod === 'creditcard' &&
        currentAmount > 1000 && isInternationalCard) {
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }
}

/**
 * Analyze impact of amount change
 */
function analyzeAmountImpact(amount) {
    const prevAmount = currentAmount;
    const analysis = analyzeGuardConditions(selectedPaymentMethod);

    console.log(`Amount change: $${prevAmount} → $${amount}`);
    console.log('Guard analysis:', analysis);

    return analysis;
}

// ============================================================================
// LOGGING AND DISPLAY FUNCTIONS (Shopping Cart Compatible)
// ============================================================================

/**
 * Start comprehensive logging using shopping cart style
 */
function logProcessingStart() {
    // Create initial flow log entry like shopping cart
    const logId = createFlowLog('Process Payment', 'POST', '/api/payment/process');

    // Store log ID globally for updating later
    window.currentPaymentLogId = logId;

    return logId;
}

/**
 * Handle successful payment response using shopping cart style
 */
function handleSuccessfulPayment(data, totalTime) {
    // Update the existing flow log with comprehensive backend response data
    updateFlowLog(window.currentPaymentLogId, data);

    // Update API reference highlighting based on patterns used
    if (data.java21_methods_used) {
        data.java21_methods_used.forEach(method => {
            highlightApiReferenceRow(method);
        });
    }

    // Update pattern matching logic display
    updatePatternMatchingResult(data);

    // Show success notification
    showSuccessNotification(data);

    // Update processing status
    updateProcessingStatusComplete(data);
}

/**
 * Handle payment processing errors using shopping cart style
 */
function handlePaymentError(error) {
    console.error('Payment failed:', error);

    // Update flow log with error
    if (window.currentPaymentLogId) {
        updateFlowLog(window.currentPaymentLogId, {
            error: error.message || 'Backend connection failed'
        });
    }

    // Show error notification
    showErrorNotification(error.message);

    // Update processing status to show error
    updateProcessingStatusError();
}

// ============================================================================
// ORIGINAL SHOPPING CART VISUAL FLOW INSPECTOR FUNCTIONS
// ============================================================================

/**
 * ORIGINAL: Create initial flow log entry for API calls
 * COPIED EXACTLY from shopping-cart-demo.js for consistency
 */
function createFlowLog(userAction, method, endpoint) {
    const logContainer = document.querySelector('.api-log-container');
    if (!logContainer) return null;

    if (logContainer.querySelector('.text-muted')) {
        logContainer.innerHTML = '';
    }

    const flowBlock = document.createElement('div');
    const logId = `flow-${Date.now()}`;
    flowBlock.id = logId;
    flowBlock.className = 'api-flow-block';

    flowBlock.innerHTML = `
        <div>👤 <strong>${userAction}</strong> (Frontend)</div>
        <div class="api-flow-child">🌐 API Call: ${method} ${endpoint}</div>
        <div class="api-flow-child" data-role="controller">🔴 Controller: Pending...</div>
    `;

    logContainer.prepend(flowBlock);
    return logId;
}

/**
 * ORIGINAL: Update flow log with backend response data
 * ADAPTED from shopping-cart-demo.js for payment processing
 */
function updateFlowLog(logId, responseData) {
    const flowBlock = document.getElementById(logId);
    if (!flowBlock) return;

    if (responseData.error) {
        flowBlock.querySelector('[data-role="controller"]').innerHTML =
            `🔴 Controller: <span class="text-danger">${responseData.error}</span>`;
        return;
    }

    let html = `🔴 Controller: <strong>${responseData.controller_method}</strong>`;

    // Handle single service call (payment processing pattern)
    if (responseData.service_method) {
        html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;

        // Java 21 methods used
        if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
            html += `<div class="api-flow-child">🔥 Java 21 Methods: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
            responseData.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }

        // Pattern matching details
        if (responseData.pattern_matched) {
            html += `<div class="api-flow-child">🎯 Pattern: ${responseData.pattern_matched}</div>`;
        }

        if (responseData.guard_condition && responseData.guard_condition !== 'none') {
            html += `<div class="api-flow-child">⚡ Guard: ${responseData.guard_condition}</div>`;
        }

        if (responseData.processing_action) {
            html += `<div class="api-flow-child">🔄 Action: ${responseData.processing_action}</div>`;
        }
    }

    // Add operation description
    if (responseData.operation_description) {
        html += `<div class="api-flow-child">💡 Operation: ${responseData.operation_description}</div>`;
    }

    // Add business rule
    if (responseData.business_rule_applied) {
        html += `<div class="api-flow-child">📋 Business Rule: ${responseData.business_rule_applied}</div>`;
    }

    // Add performance benefit
    if (responseData.performance_benefit) {
        html += `<div class="api-flow-child">⚡ Performance: ${responseData.performance_benefit}</div>`;
    }

    // Add Java 21 feature info
    if (responseData.java21_feature) {
        html += `<div class="api-flow-child">🎯 Feature: ${responseData.java21_feature}</div>`;

        if (responseData.jep_reference) {
            html += `<div class="api-flow-child">📚 JEP: ${responseData.jep_reference}</div>`;
        }
    }

    flowBlock.querySelector('[data-role="controller"]').innerHTML = html;
}

/**
 * ORIGINAL: Highlight Java methods in API reference table
 * COPIED EXACTLY from shopping-cart-demo.js
 */
function highlightJavaMethod(methodName) {
    // Normalize method names like "addLast()" -> "addLast"
    const safe = String(methodName || '').replace(/\(\)$/, '');

    // Clear any previous inline highlight we applied
    document.querySelectorAll('tr[data-highlight="1"]').forEach(r => {
        [...r.cells].forEach(c => {
            c.style.removeProperty('box-shadow');
            c.style.removeProperty('background-color');
            c.style.removeProperty('border-top');
            c.style.removeProperty('border-bottom');
            c.style.removeProperty('border-left');
            c.style.removeProperty('border-right');
        });
        r.removeAttribute('data-highlight');
    });

    // Find the target row
    const row = document.getElementById(`code-${safe}`);
    if (!row) return;

    // Paint each cell using inline !important so nothing can override it
    const cells = [...row.cells];
    cells.forEach((cell, i) => {
        // Use CSS variables if present; fall back to hard-coded colors
        const bg = getComputedStyle(document.documentElement)
            .getPropertyValue('--method-highlight-bg').trim() || '#fffbea';
        const border = getComputedStyle(document.documentElement)
            .getPropertyValue('--method-highlight-border').trim() || '#ffc107';

        cell.style.setProperty('box-shadow', `inset 0 0 0 9999px ${bg}`, 'important');
        cell.style.setProperty('background-color', 'transparent', 'important');
        cell.style.setProperty('border-top', `2px solid ${border}`, 'important');
        cell.style.setProperty('border-bottom', `2px solid ${border}`, 'important');
        if (i === 0) cell.style.setProperty('border-left', `2px solid ${border}`, 'important');
        if (i === cells.length - 1) cell.style.setProperty('border-right', `2px solid ${border}`, 'important');
    });

    row.setAttribute('data-highlight', '1');

    // Auto-remove after 2 seconds
    setTimeout(() => {
        if (!row.isConnected) return;
        cells.forEach(cell => {
            cell.style.removeProperty('box-shadow');
            cell.style.removeProperty('background-color');
            cell.style.removeProperty('border-top');
            cell.style.removeProperty('border-bottom');
            cell.style.removeProperty('border-left');
            cell.style.removeProperty('border-right');
        });
        row.removeAttribute('data-highlight');
    }, 2000);
}

/**
 * ORIGINAL: Clear the Visual Flow Inspector log
 * COPIED EXACTLY from shopping-cart-demo.js
 */
function clearApiLog() {
    const logContainer = document.querySelector('.api-log-container');
    if (!logContainer) return;

    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
}

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

/**
 * Show processing state
 */
function showProcessingState() {
    const button = document.querySelector('.btn-primary-custom');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    }
}

/**
 * Hide processing state
 */
function hideProcessingState() {
    const button = document.querySelector('.btn-primary-custom');
    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-lock me-2"></i>Process Payment - <span id="button-amount">$' + currentAmount.toLocaleString() + '</span>';
    }
}

/**
 * Update amount display
 */
function updateAmountDisplay() {
    // Update total amount display
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = '$' + currentAmount.toLocaleString();
    }

    // Update button amount
    const buttonAmount = document.getElementById('button-amount');
    if (buttonAmount) {
        buttonAmount.textContent = '$' + currentAmount.toLocaleString();
    }
}

/**
 * Update pattern matching result display
 */
function updatePatternMatchingResult(data) {
    updateProcessingStatusComplete(data);
}

/**
 * Update processing status to show completion
 */
function updateProcessingStatusComplete(data) {
    const steps = document.querySelectorAll('.status-step');

    // Mark all as complete
    steps.forEach((step, index) => {
        const icon = step.querySelector('.status-icon');
        icon.className = 'status-icon status-complete';
        icon.innerHTML = '<i class="fas fa-check"></i>';
    });

    // Update final step with result
    if (steps[3]) {
        const text = steps[3].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Payment Processing</strong></div>
            <small class="text-muted">Result: ${data.status} - ${data.message || data.statusMessage}</small>
        `;
    }
}

/**
 * Update processing status to show error
 */
function updateProcessingStatusError() {
    const steps = document.querySelectorAll('.status-step');

    if (steps[3]) {
        const icon = steps[3].querySelector('.status-icon');
        icon.className = 'status-icon status-pending';
        icon.style.background = '#ef4444';
        icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

        const text = steps[3].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Payment Processing</strong></div>
            <small class="text-muted">Status: Processing failed</small>
        `;
    }
}

/**
 * Reset processing status
 */
function resetProcessingStatus() {
    const steps = document.querySelectorAll('.status-step');

    steps.forEach((step, index) => {
        const icon = step.querySelector('.status-icon');

        if (index === 0) {
            icon.className = 'status-icon status-complete';
            icon.innerHTML = '<i class="fas fa-check"></i>';
        } else if (index === 1) {
            icon.className = 'status-icon status-active';
            icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            icon.className = 'status-icon status-pending';
            icon.innerHTML = '<i class="fas fa-clock"></i>';
        }
    });
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Show success notification
 */
function showSuccessNotification(data) {
    showToast('Success', `Payment processed successfully! Status: ${data.status}`, 'success');
}

/**
 * Show error notification
 */
function showErrorNotification(message) {
    showToast('Error', `Payment failed: ${message}`, 'error');
}

/**
 * Show info notification
 */
function showInfoNotification(message) {
    showToast('Info', message, 'info');
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast custom-toast toast-${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-${getToastIcon(type)} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remove after hiding
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Get toast icon based on type
 */
function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ============================================================================
// SCENARIO SETUP FUNCTIONS
// ============================================================================

/**
 * Setup high value international scenario
 */
function setupHighValueInternationalScenario() {
    selectedPaymentMethod = 'creditcard';
    selectedCustomerType = 'basic';
    currentAmount = 1500;
    isInternationalCard = true;

    updateUIForScenario();
}

/**
 * Setup premium PayPal scenario
 */
function setupPremiumPayPalScenario() {
    selectedPaymentMethod = 'paypal';
    selectedCustomerType = 'premium';
    currentAmount = 1000;
    isInternationalCard = false;

    updateUIForScenario();
}

/**
 * Setup large bank transfer scenario
 */
function setupLargeBankTransferScenario() {
    selectedPaymentMethod = 'banktransfer';
    selectedCustomerType = 'basic';
    currentAmount = 6000;
    isInternationalCard = false;

    updateUIForScenario();
}

/**
 * Run all patterns scenario (cycles through all methods)
 */
function runAllPatternsScenario() {
    const patterns = [
        { method: 'creditcard', amount: 500, customer: 'basic', international: false, delay: 0 },
        { method: 'creditcard', amount: 1500, customer: 'basic', international: true, delay: 3000 },
        { method: 'paypal', amount: 1000, customer: 'premium', international: false, delay: 6000 },
        { method: 'banktransfer', amount: 6000, customer: 'basic', international: false, delay: 9000 }
    ];

    patterns.forEach(pattern => {
        setTimeout(() => {
            selectedPaymentMethod = pattern.method;
            selectedCustomerType = pattern.customer;
            currentAmount = pattern.amount;
            isInternationalCard = pattern.international;

            updateUIForScenario();

            setTimeout(() => {
                processPayment();
            }, 500);
        }, pattern.delay);
    });
}

/**
 * Update UI for current scenario
 */
function updateUIForScenario() {
    // Update payment method selection
    resetPaymentMethodSelection();
    const methodCard = document.querySelector(`[data-method="${selectedPaymentMethod}"]`);
    if (methodCard) {
        selectPaymentMethod(methodCard);
    }

    // Update customer type
    resetCustomerTypeSelection();
    const customerRadio = document.getElementById(`customer-${selectedCustomerType}`);
    if (customerRadio) {
        customerRadio.checked = true;
    }

    // Update international toggle
    const internationalToggle = document.getElementById('international-card');
    if (internationalToggle) {
        internationalToggle.checked = isInternationalCard;
    }

    // Update amount display
    updateAmountDisplay();
    updateGuardConditionWarning();
}

// ============================================================================
// UI RESET FUNCTIONS
// ============================================================================

/**
 * Reset payment method selection to default
 */
function resetPaymentMethodSelection() {
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.checked = false;
    });

    // Select credit card as default
    const defaultCard = document.querySelector('[data-method="creditcard"]');
    if (defaultCard) {
        defaultCard.classList.add('selected');
        const radio = defaultCard.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    }
}

/**
 * Reset customer type selection to default
 */
function resetCustomerTypeSelection() {
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.checked = false;
    });

    const basicRadio = document.getElementById('customer-basic');
    if (basicRadio) {
        basicRadio.checked = true;
    }
}

/**
 * Reset international toggle
 */
function resetInternationalToggle() {
    const toggle = document.getElementById('international-card');
    if (toggle) {
        toggle.checked = false;
    }
}

/**
 * Hide guard condition warning
 */
function hideGuardConditionWarning() {
    const warning = document.getElementById('guard-condition-warning');
    if (warning) {
        warning.style.display = 'none';
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Map payment method to backend format
 */
function mapPaymentTypeForBackend(method) {
    const mapping = {
        'creditcard': 'CREDIT_CARD',
        'paypal': 'PAYPAL',
        'banktransfer': 'BANK_TRANSFER'
    };
    return mapping[method] || 'CREDIT_CARD';
}

/**
 * Get display name for payment method
 */
function getMethodDisplayName(method) {
    const names = {
        'creditcard': 'Credit Card',
        'paypal': 'PayPal',
        'banktransfer': 'Bank Transfer'
    };
    return names[method] || method;
}

/**
 * Get form field value with fallback
 */
function getFormValue(fieldId, fallback = '') {
    const field = document.getElementById(fieldId);
    return field ? field.value || fallback : fallback;
}

// ============================================================================
// EXPORT FOR CONSOLE DEBUGGING
// ============================================================================
window.PaymentDemo = {
    processPayment,
    testWithAmount,
    resetDemo,
    showDemoScenarios,
    runScenario,
    toggleInstructions,
    // State accessors for debugging
    getState: () => ({
        method: selectedPaymentMethod,
        customer: selectedCustomerType,
        amount: currentAmount,
        international: isInternationalCard
    }),
    setState: (state) => {
        if (state.method) selectedPaymentMethod = state.method;
        if (state.customer) selectedCustomerType = state.customer;
        if (state.amount) currentAmount = state.amount;
        if (typeof state.international === 'boolean') isInternationalCard = state.international;
        updateUIForScenario();
    }
};

console.log('🚀 Payment Processing Demo loaded successfully');
console.log('🎮 Try: PaymentDemo.testWithAmount(1500) or PaymentDemo.runScenario("high-value-international")');