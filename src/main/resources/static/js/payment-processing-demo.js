/**
 * Payment Processing Demo - Fixed JavaScript Implementation
 * FIXED: Corrected payment method selection and backend mapping
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
 * Setup payment method selection with event listeners
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
 * FIXED: Handle payment method selection with correct data attribute
 */
function selectPaymentMethod(selectedCard) {
    // Get method from data attribute
    const method = selectedCard.dataset.method;

    if (!method) {
        console.error('No data-method attribute found on card');
        return;
    }

    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class and update global state
    selectedCard.classList.add('selected');
    selectedPaymentMethod = method;

    // Log the selection using shared Visual Flow Inspector
    console.log('🔥 Selected payment method:', selectedPaymentMethod);

    // Use shared logging functions
    if (typeof logAPIFlow !== 'undefined') {
        logAPIFlow('Operation', `Selected ${getMethodDisplayName(method)} payment method`);
        logAPIFlow('Feature', `Pattern: case ${method.charAt(0).toUpperCase() + method.slice(1)}(...) ->`);
        logAPIFlow('Operation', 'Guard conditions analysis will occur on processing');
    }

    // Update API reference highlighting
    highlightApiReference(selectedPaymentMethod);

    // Update pattern matching logic display
    updatePatternMatchingLogic(selectedPaymentMethod);
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
                cardNumber: '4111111111111111',
                cardType: 'VISA',
                cvv: '123',
                expiryMonth: '12',
                expiryYear: '2026',
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
    console.log(`Testing with amount: ${amount}`);

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

    console.log(`Amount change: ${prevAmount} → ${amount}`);
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
        button.innerHTML = '<i class="fas fa-lock me-2"></i>Process Payment - <span id="button-amount"> + currentAmount.toLocaleString() + '</span>';
    }
}

/**
 * Update amount display
 */
function updateAmountDisplay() {
    // Update total amount display
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = ' + currentAmount.toLocaleString();
    }

    // Update button amount
    const buttonAmount = document.getElementById('button-amount');
    if (buttonAmount) {
        buttonAmount.textContent = ' + currentAmount.toLocaleString();
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

    // Select credit card as default
    const defaultCard = document.querySelector('[data-method="creditcard"]');
    if (defaultCard) {
        defaultCard.classList.add('selected');
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
 * FIXED: Map payment method to backend format
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

// Also create alias for shared Visual Flow Inspector
window.clearLog = clearInspectorLog;

console.log('🚀 Fixed Payment Processing Demo loaded successfully');
console.log('✅ Payment method selection corrected');
console.log('🔧 Backend mapping fixed');