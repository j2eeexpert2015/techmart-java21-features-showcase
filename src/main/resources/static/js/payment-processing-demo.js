/**
 * Payment Processing Demo - JavaScript Implementation (OPTIMIZED LAYOUT)
 * ADDED: Instruction panel starts collapsed, optimized space usage
 * FIXED: Moved all inline onclick handlers to external event listeners
 * ENHANCED: Better height management and responsive behavior
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
    setupEventListeners();
});

/**
 * NEW: Setup all event listeners to replace inline onclick handlers
 */
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Quick test amount buttons
    const amountButtons = document.querySelectorAll('[data-amount]');
    amountButtons.forEach(button => {
        const amount = parseInt(button.getAttribute('data-amount'));
        button.addEventListener('click', () => testWithAmount(amount));
    });

    // Main action buttons
    const processBtn = document.getElementById('process-payment-btn');
    if (processBtn) {
        processBtn.addEventListener('click', processPayment);
    }

    const resetBtn = document.getElementById('reset-demo-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetDemo);
    }

    const scenariosBtn = document.getElementById('scenarios-btn');
    if (scenariosBtn) {
        scenariosBtn.addEventListener('click', showDemoScenarios);
    }

    // Toggle instructions button
    const toggleInstructionsBtn = document.getElementById('toggle-instructions-btn');
    if (toggleInstructionsBtn) {
        toggleInstructionsBtn.addEventListener('click', toggleInstructions);
    }

    // Clear log button
    const clearLogBtn = document.getElementById('clear-log-btn');
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', clearLog);
    }

    // Modal scenario buttons
    const scenarioButtons = document.querySelectorAll('[data-scenario]');
    scenarioButtons.forEach(button => {
        const scenario = button.getAttribute('data-scenario');
        button.addEventListener('click', () => runScenario(scenario));
    });

    console.log('✅ Event listeners setup complete');
}

/**
 * Initialize the demo with event handlers and default state
 * UPDATED: Start with instructions collapsed for space optimization
 */
function initializeDemo() {
    setupPaymentMethodSelection();
    setupCustomerTypeSelection();
    setupInternationalCardToggle();
    setupQuickAmountButtons();

    // NEW: Initialize instructions as collapsed to save space
    initializeInstructionsCollapsed();

    // Initialize tooltips
    initializeTooltips();

    console.log('Payment Processing Demo ready');
}

/**
 * NEW: Initialize instruction panel as collapsed
 */
function initializeInstructionsCollapsed() {
    const instructionsPanel = document.querySelector('.demo-instructions-panel');
    const toggleBtn = document.getElementById('toggle-instructions-btn');

    if (instructionsPanel && toggleBtn) {
        // Start collapsed
        instructionsPanel.classList.add('collapsed');
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Show Instructions';

        console.log('Instructions panel initialized as collapsed');
    }
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
 * ENHANCED: Handle payment method selection with coordinated highlighting
 */
function selectPaymentMethod(selectedCard) {
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

    console.log('🔥 Selected payment method:', selectedPaymentMethod);

    // Use shared logging functions
    if (typeof logAPIFlow !== 'undefined') {
        logAPIFlow('Operation', `Selected ${getMethodDisplayName(method)} payment method`);
        logAPIFlow('Feature', `Pattern: case ${method.charAt(0).toUpperCase() + method.slice(1)}(...) ->`);
        logAPIFlow('Operation', 'Guard conditions analysis will occur on processing');
    }

    // ENHANCED: Highlight BOTH sections with coordinated timing
    highlightApiReference(selectedPaymentMethod);           // Table highlighting (existing)

    // Add small delay before highlighting Pattern Matching Logic for nice visual flow
    setTimeout(() => {
        highlightPatternMatchingLogic(selectedPaymentMethod);  // NEW: Logic highlighting
    }, 300);

    // Update guard condition analysis
    updateGuardConditionWarning();
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
 * UPDATED: Toggle instructions panel visibility with animation
 */
function toggleInstructions() {
    const panel = document.querySelector('.demo-instructions-panel');
    const button = document.getElementById('toggle-instructions-btn');

    if (!panel || !button) {
        console.warn('Instructions panel or button not found');
        return;
    }

    if (panel.classList.contains('collapsed')) {
        // Expand
        panel.classList.remove('collapsed');
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide';
        console.log('Instructions panel expanded');
    } else {
        // Collapse
        panel.classList.add('collapsed');
        button.innerHTML = '<i class="fas fa-eye"></i> Show Instructions';
        console.log('Instructions panel collapsed');
    }
}

// ============================================================================
// HELPER FUNCTIONS FOR EDUCATIONAL METADATA
// ============================================================================

/**
 * Update API reference table highlighting with ENHANCED VISIBILITY
 */
function highlightApiReference(method) {
    console.log('🎯 Highlighting API reference for method:', method);

    // Clear all previous highlights first
    document.querySelectorAll('.api-reference-table tr').forEach(row => {
        row.classList.remove('method-highlight');
    });

    // Define which patterns to highlight for each payment method
    const patterns = {
        'creditcard': ['pattern-switch', 'pattern-creditcard', 'pattern-guard'],
        'paypal': ['pattern-switch', 'pattern-paypal', 'pattern-sealed'],
        'banktransfer': ['pattern-switch', 'pattern-banktransfer', 'pattern-guard']
    };

    if (patterns[method]) {
        console.log('🔥 Highlighting patterns:', patterns[method]);

        patterns[method].forEach((patternId, index) => {
            const row = document.getElementById(patternId);
            if (row) {
                // Add staggered highlighting effect for visual appeal
                setTimeout(() => {
                    row.classList.add('method-highlight');
                    console.log('✅ Highlighted row with enhanced visibility:', patternId);
                }, index * 200); // 200ms delay between each highlight
            } else {
                console.warn('⚠️ Pattern row not found:', patternId);
            }
        });

        // Auto-remove highlighting after 5 seconds for clean UX
        setTimeout(() => {
            patterns[method].forEach(patternId => {
                const row = document.getElementById(patternId);
                if (row && row.classList.contains('method-highlight')) {
                    row.classList.remove('method-highlight');
                }
            });
            console.log('🔄 Auto-removed highlighting for:', method);
        }, 5000);
    } else {
        console.warn('⚠️ No highlighting patterns defined for method:', method);
    }
}

/**
 * Enhanced Pattern Matching Logic highlighting
 */
function updatePatternMatchingLogic(method) {
    console.log('🎯 Updating Pattern Matching Logic for:', method);

    const statusContainer = document.getElementById('pattern-status');
    if (!statusContainer) {
        console.warn('⚠️ Pattern status container not found');
        return;
    }

    // Update the pattern matching status steps first
    updateProcessingStatusSteps(method);

    // Then apply highlighting with slight delay for better visual flow
    setTimeout(() => {
        highlightPatternMatchingLogic(method);
    }, 100);
}

/**
 * Highlight relevant steps based on payment method and guard conditions
 */
function highlightRelevantSteps(method) {
    const steps = document.querySelectorAll('.status-step');
    const guardAnalysis = analyzeGuardConditions(method);

    if (steps.length >= 4) {
        // Step 1: Payment Method Detection (always highlighted)
        setTimeout(() => {
            steps[0].classList.add('step-highlight');
            console.log('✅ Highlighted: Payment Method Detection');
        }, 100);

        // Step 2: Guard Condition Check
        setTimeout(() => {
            if (guardAnalysis.triggered) {
                steps[1].classList.add('step-warning');
                console.log('⚡ Highlighted: Guard Condition Triggered');
            } else {
                steps[1].classList.add('step-highlight');
                console.log('✅ Highlighted: Guard Condition Check');
            }
        }, 300);

        // Step 3: Validation
        setTimeout(() => {
            steps[2].classList.add('step-highlight');
            console.log('✅ Highlighted: Validation');
        }, 500);

        // Step 4: Processing
        setTimeout(() => {
            if (guardAnalysis.triggered && (guardAnalysis.action.includes('require') || guardAnalysis.action.includes('approval'))) {
                steps[3].classList.add('step-warning');
                console.log('⚡ Highlighted: Processing (Requires Action)');
            } else {
                steps[3].classList.add('step-highlight');
                console.log('✅ Highlighted: Processing');
            }
        }, 700);
    }

    // Auto-remove highlighting after 6 seconds
    setTimeout(() => {
        document.querySelectorAll('.status-step').forEach(step => {
            step.classList.remove('step-highlight', 'step-warning', 'step-error');
        });
        console.log('🔄 Auto-removed Pattern Matching Logic highlighting');
    }, 6000);
}

/**
 * Update the processing status complete with enhanced highlighting
 */
function updateProcessingStatusComplete(data) {
    const steps = document.querySelectorAll('.status-step');

    // Clear previous highlighting
    steps.forEach(step => {
        step.classList.remove('step-highlight', 'step-warning', 'step-error');
    });

    // Determine final status highlighting
    const isSuccessful = data.status === 'APPROVED';
    const requiresAction = data.status === 'REQUIRES_VERIFICATION' || data.status === 'REQUIRES_APPROVAL';
    const isDeclined = data.status === 'DECLINED' || data.status === 'ERROR';

    // Apply final highlighting with staggered timing
    steps.forEach((step, index) => {
        setTimeout(() => {
            const icon = step.querySelector('.status-icon');

            if (isDeclined) {
                step.classList.add('step-error');
                icon.className = 'status-icon';
                icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            } else if (requiresAction && index === steps.length - 1) {
                step.classList.add('step-warning');
                icon.className = 'status-icon';
                icon.innerHTML = '<i class="fas fa-clock"></i>';
            } else {
                step.classList.add('step-highlight');
                icon.className = 'status-icon';
                icon.innerHTML = '<i class="fas fa-check"></i>';
            }
        }, index * 150);
    });

    // Update final step with result
    if (steps[3]) {
        const text = steps[3].querySelector('div:last-child');
        if (text) {
            text.innerHTML = `
                <div><strong>Payment Processing</strong></div>
                <small class="text-muted">Result: ${data.status} - ${data.message || data.statusMessage}</small>
            `;
        }
    }

    console.log('✅ Updated Pattern Matching Logic with final result:', data.status);
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
 * ENHANCED: Update processing status steps with proper visual indicators and row highlighting
 */
function updateProcessingStatusSteps(method) {
    const steps = document.querySelectorAll('.status-step');
    const guardAnalysis = analyzeGuardConditions(method);

    // Clear all existing highlight classes first
    steps.forEach(step => {
        step.classList.remove('highlight-yellow', 'highlight-orange', 'highlight-green', 'highlight-blue');
    });

    // Reset all steps
    steps.forEach(step => {
        const icon = step.querySelector('.status-icon');
        icon.className = 'status-icon status-pending';
        icon.innerHTML = '<i class="fas fa-clock"></i>';
        icon.style.removeProperty('background');
    });

    // Step 1: Payment Method Detection (Always complete when method selected)
    if (steps[0]) {
        const icon = steps[0].querySelector('.status-icon');
        icon.className = 'status-icon status-complete';
        icon.innerHTML = '<i class="fas fa-check"></i>';
        icon.style.background = '#10b981'; // Green

        const text = steps[0].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Payment Method Detection</strong></div>
            <small class="text-muted">Pattern: ${getMethodDisplayName(method)} identified</small>
        `;

        // Add green highlight effect
        setTimeout(() => {
            steps[0].classList.add('highlight-green');
        }, 100);
    }

    // Step 2: Guard Condition Check (Active/Complete based on conditions)
    if (steps[1]) {
        const icon = steps[1].querySelector('.status-icon');

        if (guardAnalysis.triggered) {
            icon.className = 'status-icon status-warning';
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            icon.style.background = '#f59e0b'; // Orange for guard triggered

            // Add orange highlight for guard conditions
            setTimeout(() => {
                steps[1].classList.add('highlight-orange');
            }, 300);
        } else {
            icon.className = 'status-icon status-complete';
            icon.innerHTML = '<i class="fas fa-check"></i>';
            icon.style.background = '#10b981'; // Green for no guards

            // Add green highlight for no guards
            setTimeout(() => {
                steps[1].classList.add('highlight-green');
            }, 300);
        }

        const text = steps[1].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Guard Condition Check</strong></div>
            <small class="text-muted">${guardAnalysis.description}</small>
        `;
    }

    // Step 3: Validation (Ready when method and conditions analyzed)
    if (steps[2]) {
        const icon = steps[2].querySelector('.status-icon');
        icon.className = 'status-icon status-active';
        icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        icon.style.background = '#06b6d4'; // Blue for ready

        const text = steps[2].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Validation</strong></div>
            <small class="text-muted">Ready for processing with ${getMethodDisplayName(method)}</small>
        `;

        // Add blue highlight for ready state
        setTimeout(() => {
            steps[2].classList.add('highlight-blue');
        }, 500);
    }

    // Step 4: Payment Processing (Pending until process button clicked)
    if (steps[3]) {
        const icon = steps[3].querySelector('.status-icon');
        icon.className = 'status-icon status-pending';
        icon.innerHTML = '<i class="fas fa-play"></i>';
        icon.style.background = '#6b7280'; // Gray for pending

        const text = steps[3].querySelector('div:last-child');
        text.innerHTML = `
            <div><strong>Payment Processing</strong></div>
            <small class="text-muted">Click "Process Payment" to execute pattern matching</small>
        `;

        // Add yellow highlight for pending action
        setTimeout(() => {
            steps[3].classList.add('highlight-yellow');
        }, 700);
    }

    console.log(`Updated pattern matching logic for ${method}:`, guardAnalysis);
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
        warning.classList.add('visible');
    } else {
        warning.classList.remove('visible');
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
        button.innerHTML = `<i class="fas fa-lock me-2"></i>Process Payment - <span id="button-amount">${currentAmount.toLocaleString()}</span>`;
    }
}

/**
 * Update amount display with proper template literals
 */
function updateAmountDisplay() {
    // Update total amount display
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = `${currentAmount.toLocaleString()}`;
    }

    // Update button amount
    const buttonAmount = document.getElementById('button-amount');
    if (buttonAmount) {
        buttonAmount.textContent = `${currentAmount.toLocaleString()}`;
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
        warning.classList.remove('visible');
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

// ============================================================================
// ALIASES AND COMPATIBILITY
// ============================================================================

// Create alias for shared Visual Flow Inspector
window.clearLog = clearInspectorLog;

// Export debug functions for console access
window.PaymentDemo = {
    // Core functions
    processPayment,
    resetDemo,
    testWithAmount,

    // Scenario functions
    runScenario,
    showDemoScenarios,

    // State inspection
    getCurrentState: () => ({
        method: selectedPaymentMethod,
        customerType: selectedCustomerType,
        amount: currentAmount,
        international: isInternationalCard
    }),

    // Direct API access
    buildPayload: buildPaymentPayload,

    // UI functions
    updateUI: updateUIForScenario,
    clearLog: clearInspectorLog,

    // NEW: Layout optimization functions
    toggleInstructions,
    getInstructionsState: () => {
        const panel = document.querySelector('.demo-instructions-panel');
        return panel ? !panel.classList.contains('collapsed') : false;
    }
};

/**
 * NEW: Pattern Matching Logic highlighting with same colors as API Reference
 * Add this to your payment-processing-demo.js file
 */

/**
 * NEW: Highlight Pattern Matching Logic steps with same colors as API Reference
 */
function highlightPatternMatchingLogic(method) {
    console.log('🎯 Highlighting Pattern Matching Logic for method:', method);

    const statusContainer = document.getElementById('pattern-status');
    if (!statusContainer) {
        console.warn('⚠️ Pattern status container not found');
        return;
    }

    // Clear previous highlights from Pattern Matching Logic
    document.querySelectorAll('.status-step').forEach(step => {
        step.classList.remove('highlight-pattern', 'highlight-switch', 'highlight-guard', 'highlight-sealed');
    });

    // Define which steps to highlight for each payment method - SAME COLORS AS API REFERENCE
    const highlightMappings = {
        'creditcard': [
            { stepIndex: 0, highlightClass: 'highlight-switch' },    // Payment Method Detection - green (switch)
            { stepIndex: 1, highlightClass: 'highlight-guard' },     // Guard Condition Check - orange (guard)
            { stepIndex: 2, highlightClass: 'highlight-pattern' },   // Validation - blue (pattern)
            { stepIndex: 3, highlightClass: 'highlight-sealed' }     // Processing - gray (sealed)
        ],
        'paypal': [
            { stepIndex: 0, highlightClass: 'highlight-switch' },    // Payment Method Detection - green (switch)
            { stepIndex: 1, highlightClass: 'highlight-sealed' },    // Guard Condition Check - gray (sealed)
            { stepIndex: 2, highlightClass: 'highlight-pattern' },   // Validation - blue (pattern)
            { stepIndex: 3, highlightClass: 'highlight-switch' }     // Processing - green (switch)
        ],
        'banktransfer': [
            { stepIndex: 0, highlightClass: 'highlight-switch' },    // Payment Method Detection - green (switch)
            { stepIndex: 1, highlightClass: 'highlight-guard' },     // Guard Condition Check - orange (guard)
            { stepIndex: 2, highlightClass: 'highlight-pattern' },   // Validation - blue (pattern)
            { stepIndex: 3, highlightClass: 'highlight-sealed' }     // Processing - gray (sealed)
        ]
    };

    const mappings = highlightMappings[method];
    if (!mappings) {
        console.warn('⚠️ No highlight mappings defined for method:', method);
        return;
    }

    const steps = document.querySelectorAll('.status-step');

    // Apply highlights with staggered timing for visual appeal - SAME AS API REFERENCE
    mappings.forEach(({ stepIndex, highlightClass }, index) => {
        if (steps[stepIndex]) {
            setTimeout(() => {
                steps[stepIndex].classList.add(highlightClass);
                console.log(`✅ Highlighted step ${stepIndex} with class: ${highlightClass}`);
            }, index * 200); // 200ms delay between each highlight - SAME AS API REFERENCE
        } else {
            console.warn(`⚠️ Step ${stepIndex} not found for highlighting`);
        }
    });

    // Auto-remove highlighting after 5 seconds - SAME AS API REFERENCE
    setTimeout(() => {
        mappings.forEach(({ stepIndex, highlightClass }) => {
            if (steps[stepIndex] && steps[stepIndex].classList.contains(highlightClass)) {
                steps[stepIndex].classList.remove(highlightClass);
            }
        });
        console.log('🔄 Auto-removed Pattern Matching Logic highlighting for:', method);
    }, 5000);
}

console.log('🚀 Optimized Payment Processing Demo loaded successfully');
console.log('✅ All inline onclick handlers moved to external event listeners');
console.log('🎯 Layout optimized: Visual Flow Inspector moved to top, instructions start collapsed');
console.log('📱 Responsive behavior enhanced for better mobile experience');
console.log('🔧 Clean HTML/CSS/JS separation achieved');
console.log('🎮 Try: PaymentDemo.testWithAmount(1500) or PaymentDemo.runScenario("high-value-international")');