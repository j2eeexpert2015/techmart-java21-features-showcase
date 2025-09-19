/**
 * Payment Processing Demo - Clean JavaScript Implementation
 * CLEANED: Removed Visual Flow Inspector duplication - now uses shared component
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
 * Updated to use shared Visual Flow Inspector
 */
function processPayment() {
    console.log('🔥 Processing payment...');

    // Show processing state
    showProcessingState();

    // Clear previous results - use shared function
    clearInspectorLog();

    // Start logging using shared Visual Flow Inspector
    const logId = createFlowLog('Process Payment', 'POST', '/api/payment/process');

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

        // Handle successful response using shared Visual Flow Inspector
        handleSuccessfulPayment(data, totalTime, logId);
    })
    .catch(error => {
        console.error('Payment processing error:', error);
        handlePaymentError(error, logId);
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
 * Handle successful payment response using shared Visual Flow Inspector
 */
function handleSuccessfulPayment(data, totalTime, logId) {
    // Update flow log with comprehensive backend response using shared function
    updateFlowLog(logId, data);

    // Update API reference highlighting based on patterns used
    if (data.java21_methods_used) {
        data.java21_methods_used.forEach(method => {
            highlightJavaMethod(method);
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
 * Handle payment processing errors using shared Visual Flow Inspector
 */
function handlePaymentError(error, logId) {
    console.error('Payment failed:', error);

    // Update flow log with error using shared function
    if (logId) {
        updateFlowLog(logId, {
            error: error.message || 'Backend connection failed'
        });
    }

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

    // Clear logs and status - use shared function
    clearInspectorLog();
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

    switch (method) {
        case 'creditcard':
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
    return names[method] || 'Credit Card';
}

/**
 * Get form value with fallback
 */
function getFormValue(elementId, fallback = '') {
    const element = document.getElementById(elementId);
    return element ? element.value || fallback : fallback;
}

/**
 * Highlight specific Java method in API reference
 */
function highlightJavaMethod(methodName) {
    // Find and highlight specific Java 21 method usage
    const methodElements = document.querySelectorAll(`[data-java-method="${methodName}"]`);
    methodElements.forEach(element => {
        element.classList.add('java-method-highlight');
        setTimeout(() => {
            element.classList.remove('java-method-highlight');
        }, 3000);
    });
}

/**
 * Format currency amount for display
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `TXN_${timestamp}_${random}`.toUpperCase();
}

/**
 * Validate payment form based on selected method
 */
function validatePaymentForm() {
    const errors = [];

    switch (selectedPaymentMethod) {
        case 'creditcard':
            const cardNumber = getFormValue('card-number');
            const cvv = getFormValue('card-cvv');
            const expiryMonth = getFormValue('expiry-month');
            const expiryYear = getFormValue('expiry-year');

            if (!cardNumber || cardNumber.length < 16) {
                errors.push('Valid card number is required');
            }
            if (!cvv || cvv.length < 3) {
                errors.push('Valid CVV is required');
            }
            if (!expiryMonth || !expiryYear) {
                errors.push('Expiry date is required');
            }
            break;

        case 'paypal':
            // PayPal validation would go here
            break;

        case 'banktransfer':
            // Bank transfer validation would go here
            break;
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Get processing fee based on method and amount
 */
function calculateProcessingFee(method, amount) {
    const feeRates = {
        'creditcard': 0.029, // 2.9%
        'paypal': 0.034,     // 3.4%
        'banktransfer': 0.01 // 1.0%
    };

    const rate = feeRates[method] || 0.029;
    return Math.round(amount * rate * 100) / 100;
}

/**
 * Get estimated processing time
 */
function getEstimatedProcessingTime(method) {
    const times = {
        'creditcard': 'Instant',
        'paypal': '1-2 minutes',
        'banktransfer': '1-3 business days'
    };
    return times[method] || 'Unknown';
}

/**
 * Check if amount requires special handling
 */
function requiresSpecialHandling(amount, method, isInternational = false) {
    if (method === 'creditcard' && amount > 1000 && isInternational) {
        return {
            required: true,
            reason: 'High-value international transaction',
            additionalSteps: ['Enhanced verification', 'Fraud check', 'Manual review']
        };
    }

    if (method === 'banktransfer' && amount >= 5000) {
        return {
            required: true,
            reason: 'Large bank transfer',
            additionalSteps: ['Manager approval', 'AML check', 'Wire transfer setup']
        };
    }

    return {
        required: false,
        reason: 'Standard processing',
        additionalSteps: []
    };
}

/**
 * Log demo activity for analytics
 */
function logDemoActivity(action, data = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: action,
        paymentMethod: selectedPaymentMethod,
        amount: currentAmount,
        customerType: selectedCustomerType,
        isInternational: isInternationalCard,
        ...data
    };

    console.log('Demo Activity:', logEntry);

    // In a real app, you might send this to an analytics service
    // analytics.track('payment_demo_activity', logEntry);
}

/**
 * Get payment method icon class
 */
function getPaymentMethodIcon(method) {
    const icons = {
        'creditcard': 'fas fa-credit-card',
        'paypal': 'fab fa-paypal',
        'banktransfer': 'fas fa-university'
    };
    return icons[method] || 'fas fa-credit-card';
}

/**
 * Check browser compatibility for demo features
 */
function checkBrowserCompatibility() {
    const features = {
        fetch: typeof fetch !== 'undefined',
        promises: typeof Promise !== 'undefined',
        localStorage: typeof Storage !== 'undefined',
        bootstrap: typeof bootstrap !== 'undefined'
    };

    const incompatible = Object.keys(features).filter(feature => !features[feature]);

    if (incompatible.length > 0) {
        console.warn('Some demo features may not work due to browser compatibility:', incompatible);
        showToast('Warning', 'Some features may not work in your browser', 'warning');
    }

    return features;
}

/**
 * Initialize demo with browser compatibility check
 */
function initializeDemoSafely() {
    try {
        checkBrowserCompatibility();
        initializeDemo();
        logDemoActivity('demo_initialized');
    } catch (error) {
        console.error('Demo initialization failed:', error);
        showToast('Error', 'Demo initialization failed', 'error');
    }
}

/**
 * Handle demo errors gracefully
 */
function handleDemoError(error, context = 'general') {
    console.error(`Demo error in ${context}:`, error);

    logDemoActivity('error_occurred', {
        context: context,
        error: error.message || error.toString()
    });

    // Show user-friendly error message
    const errorMessages = {
        'payment_processing': 'Payment processing encountered an error. Please try again.',
        'form_validation': 'Please check your form inputs and try again.',
        'network': 'Network connection issue. Please check your internet connection.',
        'general': 'An unexpected error occurred. Please refresh the page and try again.'
    };

    const message = errorMessages[context] || errorMessages.general;
    showErrorNotification(message);
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Monitor performance metrics
 */
const performanceMonitor = {
    metrics: {},

    start(label) {
        this.metrics[label] = {
            startTime: performance.now(),
            endTime: null,
            duration: null
        };
    },

    end(label) {
        if (this.metrics[label]) {
            this.metrics[label].endTime = performance.now();
            this.metrics[label].duration = this.metrics[label].endTime - this.metrics[label].startTime;

            console.log(`Performance [${label}]: ${Math.round(this.metrics[label].duration)}ms`);
            return this.metrics[label].duration;
        }
        return 0;
    },

    getMetrics() {
        return { ...this.metrics };
    },

    clear() {
        this.metrics = {};
    }
};

// ============================================================================
// DEMO ANALYTICS AND INSIGHTS
// ============================================================================

/**
 * Track user interactions for demo insights
 */
const demoAnalytics = {
    interactions: [],
    sessionStartTime: Date.now(),

    track(event, data = {}) {
        const interaction = {
            timestamp: Date.now(),
            event: event,
            sessionTime: Date.now() - this.sessionStartTime,
            data: data
        };

        this.interactions.push(interaction);
        console.log('Demo Analytics:', interaction);
    },

    getSessionSummary() {
        const sessionDuration = Date.now() - this.sessionStartTime;
        const eventCounts = this.interactions.reduce((acc, interaction) => {
            acc[interaction.event] = (acc[interaction.event] || 0) + 1;
            return acc;
        }, {});

        return {
            sessionDuration: sessionDuration,
            totalInteractions: this.interactions.length,
            eventCounts: eventCounts,
            averageTimePerAction: sessionDuration / this.interactions.length || 0
        };
    }
};

// ============================================================================
// INITIALIZATION AND ERROR HANDLING
// ============================================================================

// Global error handler for the demo
window.addEventListener('error', (event) => {
    handleDemoError(event.error, 'javascript_error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    handleDemoError(event.reason, 'promise_rejection');
    event.preventDefault();
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemoSafely);
} else {
    // DOM is already ready
    initializeDemoSafely();
}

// Export functions for testing (if in a module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processPayment,
        buildPaymentPayload,
        analyzeGuardConditions,
        validatePaymentForm,
        calculateProcessingFee,
        formatCurrency,
        performanceMonitor,
        demoAnalytics
    };
}