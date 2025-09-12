/**
 * TechMart Payment Processing Demo - JavaScript
 * Interactive demonstration of Java 21 Pattern Matching for Switch with Sealed Payment Hierarchy
 *
 * Author: Java 21 Course
 * Purpose: Showcase Pattern Matching, Guard Conditions, and Sealed Interfaces through payment processing
 * Features: Real-time pattern matching visualization, educational flow inspector, dynamic form updates
 */

/* ================================
   DEMO CONFIGURATION AND STATE
   ================================ */

const PAYMENT_DEMO_CONFIG = {
    customerId: 1,
    baseUrl: '', // Will be set based on environment
    orderAmount: 3996.00,

    // Guard condition thresholds
    highValueThreshold: 1000,
    internationalProcessingFee: 2.5, // percentage
    premiumCustomerDiscount: 10 // percentage
};

// Demo state for tracking user interactions
const PaymentDemoState = {
    selectedPaymentMethod: 'creditcard',
    customerType: 'standard', // standard, premium, vip
    isInternational: false,
    validationErrors: [],
    processingStep: 'method_selection',
    patternMatchingResults: []
};

/* ================================
   INITIALIZATION
   ================================ */

/**
 * Initialize the payment processing demo when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Payment Processing Demo Initializing...');

    setupEventListeners();
    initializePaymentForm();
    simulateInitialPatternMatching();

    console.log('✅ Payment Processing Demo Ready');
});

/**
 * Setup all event listeners for interactive elements
 */
function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.addEventListener('click', handlePaymentMethodSelection);
        card.addEventListener('keydown', handlePaymentMethodKeydown);
    });

    // Radio button changes
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });

    // Form field changes for real-time validation
    const formFields = ['card-number', 'card-cvv', 'expiry-month', 'expiry-year'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', handleFormFieldChange);
            field.addEventListener('blur', validateField);
        }
    });

    console.log('📋 Event listeners setup complete');
}

/* ================================
   PAYMENT METHOD SELECTION HANDLERS
   ================================ */

/**
 * Handle payment method card selection
 * @param {Event} event - Click event on payment method card
 */
function handlePaymentMethodSelection(event) {
    event.preventDefault();

    const card = event.currentTarget;
    const paymentMethod = card.getAttribute('data-method');

    if (paymentMethod === PaymentDemoState.selectedPaymentMethod) {
        return; // Already selected
    }

    // Update UI state
    updateSelectedPaymentMethod(paymentMethod);

    // Update form
    updateDynamicPaymentForm(paymentMethod);

    // Simulate pattern matching
    simulatePatternMatching(paymentMethod);

    // Log the interaction
    logPatternMatchingFlow('Payment Method Selection', paymentMethod);
}

/**
 * Handle keyboard navigation for payment method cards
 * @param {KeyboardEvent} event - Keyboard event
 */
function handlePaymentMethodKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePaymentMethodSelection(event);
    }
}

/**
 * Handle radio button changes
 * @param {Event} event - Change event on radio button
 */
function handlePaymentMethodChange(event) {
    const paymentMethod = event.target.value;
    updateSelectedPaymentMethod(paymentMethod);
    updateDynamicPaymentForm(paymentMethod);
    simulatePatternMatching(paymentMethod);
}

/**
 * Update the selected payment method in UI
 * @param {string} paymentMethod - Selected payment method (creditcard, paypal, banktransfer)
 */
function updateSelectedPaymentMethod(paymentMethod) {
    // Update card selection
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-method="${paymentMethod}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update radio buttons
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.checked = radio.value === paymentMethod;
    });

    PaymentDemoState.selectedPaymentMethod = paymentMethod;

    // Highlight corresponding API reference
    highlightPatternMatchingReference(paymentMethod);
}

/* ================================
   DYNAMIC FORM UPDATES
   ================================ */

/**
 * Update the payment form based on selected method
 * @param {string} paymentMethod - Selected payment method
 */
function updateDynamicPaymentForm(paymentMethod) {
    const formContainer = document.getElementById('payment-form');
    const patternIndicator = formContainer.querySelector('.pattern-matching-indicator');

    // Update pattern indicator
    if (patternIndicator) {
        patternIndicator.textContent = `Pattern: ${getPatternName(paymentMethod)}`;
    }

    // Generate appropriate form content
    let formContent = '';

    switch (paymentMethod) {
        case 'creditcard':
            formContent = generateCreditCardForm();
            break;
        case 'paypal':
            formContent = generatePayPalForm();
            break;
        case 'banktransfer':
            formContent = generateBankTransferForm();
            break;
        default:
            formContent = generateCreditCardForm();
    }

    // Update form content (preserve header)
    const header = formContainer.querySelector('h6');
    formContainer.innerHTML = '';
    formContainer.appendChild(header);
    formContainer.insertAdjacentHTML('beforeend', formContent);

    // Show guard condition warning if applicable
    updateGuardConditionWarning(paymentMethod);

    // Re-attach event listeners to new form fields
    attachFormFieldListeners();
}

/**
 * Generate credit card form HTML
 * @returns {string} HTML content for credit card form
 */
function generateCreditCardForm() {
    return `
        <div class="row">
            <div class="col-md-8">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-control" placeholder="1234 5678 9012 3456"
                       id="card-number" maxlength="19">
            </div>
            <div class="col-md-4">
                <label class="form-label">CVV</label>
                <input type="text" class="form-control" placeholder="123"
                       id="card-cvv" maxlength="4">
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-md-6">
                <label class="form-label">Expiry Month</label>
                <select class="form-control" id="expiry-month">
                    <option value="">Select Month</option>
                    <option value="01">01 - January</option>
                    <option value="02">02 - February</option>
                    <option value="03">03 - March</option>
                    <option value="12">12 - December</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Expiry Year</label>
                <select class="form-control" id="expiry-year">
                    <option value="">Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                </select>
            </div>
        </div>

        <div class="validation-feedback" id="guard-condition-warning" style="display: none;">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>High-Value International Transaction Detected</strong><br>
            Amount > $1,000 with international card requires additional verification.
        </div>
    `;
}

/**
 * Generate PayPal form HTML
 * @returns {string} HTML content for PayPal form
 */
function generatePayPalForm() {
    return `
        <div class="row">
            <div class="col-12">
                <label class="form-label">PayPal Email Address</label>
                <input type="email" class="form-control" placeholder="your.email@example.com"
                       id="paypal-email">
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="paypal-save-payment">
                    <label class="form-check-label" for="paypal-save-payment">
                        Save PayPal account for future payments
                    </label>
                </div>
            </div>
        </div>

        <div class="alert alert-info mt-3" role="alert">
            <i class="fab fa-paypal me-2"></i>
            <strong>PayPal Express Checkout:</strong> Premium customers get expedited processing.
        </div>
    `;
}

/**
 * Generate Bank Transfer form HTML
 * @returns {string} HTML content for bank transfer form
 */
function generateBankTransferForm() {
    return `
        <div class="row">
            <div class="col-md-8">
                <label class="form-label">Account Number</label>
                <input type="text" class="form-control" placeholder="1234567890"
                       id="account-number" maxlength="17">
            </div>
            <div class="col-md-4">
                <label class="form-label">Account Type</label>
                <select class="form-control" id="account-type">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                </select>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-md-6">
                <label class="form-label">Routing Number</label>
                <input type="text" class="form-control" placeholder="021000021"
                       id="routing-number" maxlength="9">
            </div>
            <div class="col-md-6">
                <label class="form-label">Bank Name</label>
                <input type="text" class="form-control" placeholder="Your Bank Name"
                       id="bank-name">
            </div>
        </div>

        <div class="alert alert-warning mt-3" role="alert">
            <i class="fas fa-clock me-2"></i>
            <strong>Processing Time:</strong> Bank transfers typically take 3-5 business days to process.
        </div>
    `;
}

/* ================================
   PATTERN MATCHING SIMULATION
   ================================ */

/**
 * Simulate Java 21 pattern matching logic
 * @param {string} paymentMethod - Selected payment method
 */
function simulatePatternMatching(paymentMethod) {
    const amount = PAYMENT_DEMO_CONFIG.orderAmount;
    const isHighValue = amount > PAYMENT_DEMO_CONFIG.highValueThreshold;

    // Reset previous pattern matching results
    PaymentDemoState.patternMatchingResults = [];

    // Simulate pattern matching switch logic
    let matchResult;

    switch (paymentMethod) {
        case 'creditcard':
            matchResult = simulateCreditCardPattern(amount, isHighValue);
            break;
        case 'paypal':
            matchResult = simulatePayPalPattern(amount);
            break;
        case 'banktransfer':
            matchResult = simulateBankTransferPattern(amount);
            break;
        default:
            matchResult = { pattern: 'default', action: 'standard processing' };
    }

    // Update pattern matching status
    updatePatternMatchingStatus(matchResult);

    // Update code preview
    updateCodePreview(paymentMethod, matchResult);

    PaymentDemoState.patternMatchingResults.push(matchResult);
}

/**
 * Simulate credit card pattern matching with guards
 * @param {number} amount - Transaction amount
 * @param {boolean} isHighValue - Whether transaction is high value
 * @returns {Object} Pattern matching result
 */
function simulateCreditCardPattern(amount, isHighValue) {
    const isInternational = Math.random() > 0.7; // Simulate international detection

    if (isHighValue && isInternational) {
        return {
            pattern: 'CreditCard',
            guard: 'amount > 1000 && isInternational',
            action: 'requireAdditionalVerification',
            message: 'High-value international transaction requires verification',
            processingFee: amount * (PAYMENT_DEMO_CONFIG.internationalProcessingFee / 100)
        };
    } else if (isHighValue) {
        return {
            pattern: 'CreditCard',
            guard: 'amount > 1000',
            action: 'processHighValue',
            message: 'High-value transaction - enhanced security',
            processingFee: 0
        };
    } else {
        return {
            pattern: 'CreditCard',
            guard: 'none',
            action: 'processStandard',
            message: 'Standard credit card processing',
            processingFee: 0
        };
    }
}

/**
 * Simulate PayPal pattern matching
 * @param {number} amount - Transaction amount
 * @returns {Object} Pattern matching result
 */
function simulatePayPalPattern(amount) {
    const isPremiumCustomer = PaymentDemoState.customerType !== 'standard';

    if (isPremiumCustomer) {
        return {
            pattern: 'PayPal',
            guard: 'isPremiumCustomer',
            action: 'processExpedited',
            message: 'Premium customer - expedited PayPal processing',
            processingFee: 0,
            discount: amount * (PAYMENT_DEMO_CONFIG.premiumCustomerDiscount / 100)
        };
    } else {
        return {
            pattern: 'PayPal',
            guard: 'none',
            action: 'processStandard',
            message: 'Standard PayPal processing',
            processingFee: amount * 0.029 // 2.9% PayPal fee
        };
    }
}

/**
 * Simulate bank transfer pattern matching
 * @param {number} amount - Transaction amount
 * @returns {Object} Pattern matching result
 */
function simulateBankTransferPattern(amount) {
    const isLargeTransfer = amount > 5000;

    if (isLargeTransfer) {
        return {
            pattern: 'BankTransfer',
            guard: 'amount > 5000',
            action: 'requireManagerApproval',
            message: 'Large bank transfer requires manager approval',
            processingTime: '5-7 business days'
        };
    } else {
        return {
            pattern: 'BankTransfer',
            guard: 'none',
            action: 'processStandard',
            message: 'Standard bank transfer processing',
            processingTime: '3-5 business days'
        };
    }
}

/* ================================
   UI UPDATE FUNCTIONS
   ================================ */

/**
 * Update pattern matching status display
 * @param {Object} matchResult - Result from pattern matching simulation
 */
function updatePatternMatchingStatus(matchResult) {
    const statusContainer = document.getElementById('pattern-status');

    const statusHTML = `
        <div class="status-step">
            <div class="status-icon status-complete">
                <i class="fas fa-check"></i>
            </div>
            <div>
                <div><strong>Pattern Matched</strong></div>
                <small class="text-muted">Pattern: ${matchResult.pattern} identified</small>
            </div>
        </div>

        <div class="status-step">
            <div class="status-icon ${matchResult.guard !== 'none' ? 'status-active' : 'status-complete'}">
                <i class="fas ${matchResult.guard !== 'none' ? 'fa-exclamation-triangle' : 'fa-check'}"></i>
            </div>
            <div>
                <div><strong>Guard Condition</strong></div>
                <small class="text-muted">${matchResult.guard !== 'none' ? matchResult.guard : 'No guards triggered'}</small>
            </div>
        </div>

        <div class="status-step">
            <div class="status-icon status-active">
                <i class="fas fa-cogs"></i>
            </div>
            <div>
                <div><strong>Processing Action</strong></div>
                <small class="text-muted">${matchResult.action}</small>
            </div>
        </div>

        <div class="status-step">
            <div class="status-icon status-pending">
                <i class="fas fa-clock"></i>
            </div>
            <div>
                <div><strong>Ready to Process</strong></div>
                <small class="text-muted">${matchResult.message}</small>
            </div>
        </div>
    `;

    statusContainer.innerHTML = statusHTML;
}

/**
 * Update code preview with current pattern
 * @param {string} paymentMethod - Selected payment method
 * @param {Object} matchResult - Pattern matching result
 */
function updateCodePreview(paymentMethod, matchResult) {
    const codeContainer = document.getElementById('code-preview');

    let codeExample = '';

    switch (paymentMethod) {
        case 'creditcard':
            codeExample = `switch (paymentMethod) {
  case CreditCard(var number, var type, var cvv)
       when amount > 1000 && isInternational(number) -> {
    requireAdditionalVerification();
    applyInternationalFee(${matchResult.processingFee?.toFixed(2) || '0.00'});
  }

  case CreditCard(var number, var type, var cvv)
       when amount > 1000 ->
    processHighValueTransaction(number);

  case CreditCard(var number, var type, var cvv) ->
    processStandardPayment(number, type, cvv);
}`;
            break;

        case 'paypal':
            codeExample = `switch (paymentMethod) {
  case PayPal(var email)
       when isPremiumCustomer(customer) -> {
    processExpedited(email);
    applyPremiumDiscount(${matchResult.discount?.toFixed(2) || '0.00'});
  }

  case PayPal(var email) -> {
    processStandardPayPal(email);
    applyProcessingFee(${matchResult.processingFee?.toFixed(2) || '0.00'});
  }
}`;
            break;

        case 'banktransfer':
            codeExample = `switch (paymentMethod) {
  case BankTransfer(var account, var routing)
       when amount > 5000 -> {
    requireManagerApproval();
    setProcessingTime("${matchResult.processingTime}");
  }

  case BankTransfer(var account, var routing) ->
    processStandardTransfer(account, routing);
}`;
            break;
    }

    codeContainer.innerHTML = `<pre>${codeExample}</pre>`;
}

/**
 * Update guard condition warning visibility
 * @param {string} paymentMethod - Selected payment method
 */
function updateGuardConditionWarning(paymentMethod) {
    const warning = document.getElementById('guard-condition-warning');

    if (paymentMethod === 'creditcard' && PAYMENT_DEMO_CONFIG.orderAmount > PAYMENT_DEMO_CONFIG.highValueThreshold) {
        warning.style.display = 'block';
        warning.classList.add('show');
    } else {
        warning.style.display = 'none';
        warning.classList.remove('show');
    }
}

/* ================================
   FORM VALIDATION AND PROCESSING
   ================================ */

/**
 * Handle form field changes for real-time feedback
 * @param {Event} event - Input event
 */
function handleFormFieldChange(event) {
    const field = event.target;
    const value = field.value;

    // Simulate real-time pattern matching based on field changes
    if (field.id === 'card-number') {
        simulateCardTypeDetection(value);
    }

    // Clear previous validation errors for this field
    clearFieldError(field);
}

/**
 * Validate individual form field
 * @param {Event} event - Blur event
 */
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();

    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
        case 'card-number':
            isValid = validateCardNumber(value);
            errorMessage = 'Please enter a valid card number';
            break;
        case 'card-cvv':
            isValid = /^\d{3,4}$/.test(value);
            errorMessage = 'Please enter a valid CVV (3-4 digits)';
            break;
        case 'paypal-email':
            isValid = validateEmail(value);
            errorMessage = 'Please enter a valid email address';
            break;
        case 'account-number':
            isValid = /^\d{8,17}$/.test(value);
            errorMessage = 'Please enter a valid account number';
            break;
        case 'routing-number':
            isValid = /^\d{9}$/.test(value);
            errorMessage = 'Please enter a valid 9-digit routing number';
            break;
    }

    if (!isValid && value !== '') {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

/**
 * Process payment (main action button)
 */
function processPayment() {
    console.log('🔄 Processing payment...');

    // Validate all form fields
    const isFormValid = validatePaymentForm();

    if (!isFormValid) {
        showNotification('Please correct the form errors before proceeding.', 'warning');
        return;
    }

    // Simulate payment processing
    simulatePaymentProcessing();
}

/**
 * Validate entire payment form
 * @returns {boolean} Whether form is valid
 */
function validatePaymentForm() {
    const method = PaymentDemoState.selectedPaymentMethod;
    let requiredFields = [];

    switch (method) {
        case 'creditcard':
            requiredFields = ['card-number', 'card-cvv', 'expiry-month', 'expiry-year'];
            break;
        case 'paypal':
            requiredFields = ['paypal-email'];
            break;
        case 'banktransfer':
            requiredFields = ['account-number', 'routing-number', 'bank-name'];
            break;
    }

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField({ target: field })) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Simulate payment processing with realistic delays and feedback
 */
async function simulatePaymentProcessing() {
    const processingButton = document.querySelector('.btn-primary-custom');
    const originalText = processingButton.innerHTML;

    // Show processing state
    processingButton.disabled = true;
    processingButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing Payment...';

    // Log the processing flow
    logPatternMatchingFlow('Payment Processing Started', PaymentDemoState.selectedPaymentMethod);

    try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate successful processing
        const result = PaymentDemoState.patternMatchingResults[PaymentDemoState.patternMatchingResults.length - 1];

        processingButton.innerHTML = '<i class="fas fa-check me-2"></i>Payment Successful!';
        processingButton.className = 'btn btn-success btn-lg w-100';

        // Log successful completion
        logPatternMatchingFlow('Payment Completed', `${result.pattern} - ${result.action}`);

        showNotification(
            `Payment processed successfully using ${result.pattern} pattern matching!`,
            'success'
        );

        // Reset after delay
        setTimeout(() => {
            processingButton.disabled = false;
            processingButton.innerHTML = originalText;
            processingButton.className = 'btn btn-primary-custom btn-lg w-100';
        }, 3000);

    } catch (error) {
        // Handle processing error
        processingButton.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Payment Failed';
        processingButton.className = 'btn btn-danger btn-lg w-100';

        showNotification('Payment processing failed. Please try again.', 'danger');

        setTimeout(() => {
            processingButton.disabled = false;
            processingButton.innerHTML = originalText;
            processingButton.className = 'btn btn-primary-custom btn-lg w-100';
        }, 3000);
    }
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

/**
 * Get pattern name for display
 * @param {string} paymentMethod - Payment method identifier
 * @returns {string} Display name for pattern
 */
function getPatternName(paymentMethod) {
    const names = {
        'creditcard': 'CreditCard',
        'paypal': 'PayPal',
        'banktransfer': 'BankTransfer'
    };
    return names[paymentMethod] || 'Unknown';
}

/**
 * Highlight API reference row for pattern matching
 * @param {string} patternType - Type of pattern to highlight
 */
function highlightPatternMatchingReference(patternType) {
    // Clear previous highlights
    document.querySelectorAll('.api-reference-table tr').forEach(row => {
        row.classList.remove('pattern-highlight');
    });

    // Highlight relevant rows
    const highlightIds = {
        'creditcard': ['pattern-switch', 'pattern-creditcard', 'pattern-guard'],
        'paypal': ['pattern-switch', 'pattern-paypal', 'pattern-sealed'],
        'banktransfer': ['pattern-switch', 'pattern-banktransfer', 'pattern-sealed']
    };

    const idsToHighlight = highlightIds[patternType] || [];
    idsToHighlight.forEach(id => {
        const row = document.getElementById(id);
        if (row) {
            row.classList.add('pattern-highlight');
        }
    });

    // Remove highlights after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.pattern-highlight').forEach(row => {
            row.classList.remove('pattern-highlight');
        });
    }, 3000);
}

/**
 * Log pattern matching flow in visual inspector
 * @param {string} userAction - Description of user action
 * @param {string} details - Additional details
 */
function logPatternMatchingFlow(userAction, details) {
    const logContainer = document.getElementById('api-log');

    // Clear initial message if present
    if (logContainer.querySelector('.text-muted')) {
        logContainer.innerHTML = '';
    }

    const logEntry = document.createElement('div');
    logEntry.className = 'api-flow-block';

    const timestamp = new Date().toLocaleTimeString();

    logEntry.innerHTML = `
        <div>👤 <strong>${userAction}</strong> (Frontend)</div>
        <div class="api-flow-child">🎯 Pattern: switch(${details})</div>
        <div class="api-flow-child">🔥 Java 21 Feature: <span class="java21-pattern-tag">Pattern Matching</span></div>
        <div class="api-flow-child">⏰ ${timestamp}</div>
    `;

    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Limit log entries to prevent overflow
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

/**
 * Clear the visual flow inspector log
 */
function clearInspectorLog() {
    const logContainer = document.getElementById('api-log');
    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Select a payment method to see pattern matching...</div>';
}

/**
 * Initialize payment form with default values
 */
function initializePaymentForm() {
    // Set default payment method
    updateSelectedPaymentMethod('creditcard');
    updateDynamicPaymentForm('creditcard');

    // Set default customer type for demo
    PaymentDemoState.customerType = 'premium'; // Can be changed for different demos

    console.log('💳 Payment form initialized with default values');
}

/**
 * Simulate initial pattern matching on page load
 */
function simulateInitialPatternMatching() {
    setTimeout(() => {
        simulatePatternMatching('creditcard');
        logPatternMatchingFlow('Page Loaded', 'Initial CreditCard pattern detection');
    }, 500);
}

/**
 * Attach event listeners to dynamically created form fields
 */
function attachFormFieldListeners() {
    const dynamicFields = document.querySelectorAll('#payment-form input, #payment-form select');

    dynamicFields.forEach(field => {
        field.addEventListener('input', handleFormFieldChange);
        field.addEventListener('blur', validateField);
    });
}

/**
 * Simulate card type detection from card number
 * @param {string} cardNumber - Card number input
 */
function simulateCardTypeDetection(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    let cardType = 'unknown';

    if (cleanNumber.startsWith('4')) {
        cardType = 'visa';
    } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
        cardType = 'mastercard';
    } else if (cleanNumber.startsWith('3')) {
        cardType = 'amex';
    }

    if (cardType !== 'unknown' && cleanNumber.length >= 4) {
        logPatternMatchingFlow('Card Type Detected', `${cardType.toUpperCase()} pattern matched`);
    }
}

/**
 * Validate credit card number using Luhn algorithm (simplified)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} Whether card number is valid
 */
function validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show field validation error
 * @param {HTMLElement} field - Form field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);

    // Add error class
    field.classList.add('is-invalid');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;
    errorElement.setAttribute('data-error-for', field.id);

    // Insert after field
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear field validation error
 * @param {HTMLElement} field - Form field element
 */
function clearFieldError(field) {
    field.classList.remove('is-invalid');

    // Remove error message
    const errorElement = field.parentNode.querySelector(`[data-error-for="${field.id}"]`);
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Show notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, warning, danger, info)
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.setAttribute('role', 'alert');

    const icons = {
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'danger': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };

    notification.innerHTML = `
        <i class="${icons[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);

    console.log(`📢 Notification (${type}): ${message}`);
}

/* ================================
   DEMO ENHANCEMENT FUNCTIONS
   ================================ */

/**
 * Toggle customer type for demo purposes
 * @param {string} customerType - Customer type (standard, premium, vip)
 */
function setCustomerType(customerType) {
    PaymentDemoState.customerType = customerType;

    // Re-simulate pattern matching with new customer type
    simulatePatternMatching(PaymentDemoState.selectedPaymentMethod);

    showNotification(`Customer type changed to: ${customerType.toUpperCase()}`, 'info');

    console.log(`👤 Customer type changed to: ${customerType}`);
}

/**
 * Toggle international status for demo purposes
 * @param {boolean} isInternational - Whether customer is international
 */
function setInternationalStatus(isInternational) {
    PaymentDemoState.isInternational = isInternational;

    // Re-simulate pattern matching
    simulatePatternMatching(PaymentDemoState.selectedPaymentMethod);

    const status = isInternational ? 'International' : 'Domestic';
    showNotification(`Customer status changed to: ${status}`, 'info');
}

/**
 * Demonstrate different guard conditions
 * @param {number} amount - Custom amount to test with
 */
function testWithCustomAmount(amount) {
    const originalAmount = PAYMENT_DEMO_CONFIG.orderAmount;
    PAYMENT_DEMO_CONFIG.orderAmount = amount;

    // Update order summary display
    updateOrderSummaryTotal(amount);

    // Re-simulate pattern matching with new amount
    simulatePatternMatching(PaymentDemoState.selectedPaymentMethod);

    showNotification(`Testing with amount: ${amount.toLocaleString()}`, 'info');

    // Reset after 10 seconds
    setTimeout(() => {
        PAYMENT_DEMO_CONFIG.orderAmount = originalAmount;
        updateOrderSummaryTotal(originalAmount);
        simulatePatternMatching(PaymentDemoState.selectedPaymentMethod);
    }, 10000);
}

/**
 * Update order summary total display
 * @param {number} amount - New total amount
 */
function updateOrderSummaryTotal(amount) {
    const totalElement = document.querySelector('.total-amount');
    const buttonElement = document.querySelector('.btn-primary-custom');

    if (totalElement) {
        totalElement.textContent = `${amount.toLocaleString()}`;
    }

    if (buttonElement && !buttonElement.disabled) {
        buttonElement.innerHTML = `<i class="fas fa-lock me-2"></i>Process Payment - ${amount.toLocaleString()}`;
    }
}

/* ================================
   ACCESSIBILITY ENHANCEMENTS
   ================================ */

/**
 * Announce pattern matching results to screen readers
 * @param {Object} matchResult - Pattern matching result
 */
function announcePatternResult(matchResult) {
    const announcement = `Pattern ${matchResult.pattern} matched. ${matchResult.message}`;

    // Create temporary element for screen reader announcement
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcer);
    }, 1000);
}

/* ================================
   EXPORT DEMO FUNCTIONS FOR TESTING
   ================================ */

// Make demo functions available globally for testing and debugging
window.PaymentProcessingDemo = {
    config: PAYMENT_DEMO_CONFIG,
    state: PaymentDemoState,
    setCustomerType,
    setInternationalStatus,
    testWithCustomAmount,
    simulatePatternMatching,
    processPayment,
    clearInspectorLog
};

console.log('💳 Payment Processing Demo JavaScript loaded successfully');
console.log('🎯 Demo functions available via window.PaymentProcessingDemo');