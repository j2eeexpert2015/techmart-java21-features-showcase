/**
 * Enhanced Simple Payment Demo - JavaScript with Detailed API Response Handling
 *
 * UPDATED: Handles enhanced API responses with comprehensive service method tracking
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;
let demoStartTime = Date.now();
let logEntryCount = 0;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing enhanced payment demo...');
    initializeDemo();
});

/**
 * Initialize the enhanced demo
 */
function initializeDemo() {
    console.log('Initializing enhanced payment demo...');
    setupPaymentMethodSelection();
    setupAmountSelection();

    // Clear initial log and show welcome
    clearLog();
    logFlowEntry('🚀 Demo Initialization', 'Enhanced Java 21 Pattern Matching Demo started');
    logFlowEntry('🎯 Ready', 'Select payment method and amount, then process to see Java 21 in action');
    logFlowEntry('🔥 Features', 'Pattern matching, guard conditions, yield expressions', 'java21');

    console.log('✅ Enhanced payment demo initialized successfully');
}

/**
 * Setup payment method selection handlers
 */
function setupPaymentMethodSelection() {
    const paymentCards = document.querySelectorAll('.payment-method-card');
    console.log('Found payment cards:', paymentCards.length);

    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Payment card clicked:', this.dataset.method);
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
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    });
}

/**
 * Handle payment method selection with enhanced logging
 */
function selectPaymentMethod(selectedCard) {
    const method = selectedCard.dataset.method;
    console.log('Selecting payment method:', method);

    // Remove selected class from all cards
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card
    selectedCard.classList.add('selected');

    // Update current method
    currentMethod = method;

    // Enhanced logging with pattern matching preview
    logFlowSeparator('Payment Method Selection');
    logFlowEntry('👤 User Action', `Selected ${getMethodDisplayName(method)} payment method`);
    logFlowEntry('🎯 Pattern Preview', `switch(method) case "${method}" -> ...`);
    logFlowEntry('🔥 Java 21', 'Pattern matching switch expression ready', 'java21');
    logFlowEntry('📊 Business Logic', getPatternDescription(method));
}

/**
 * Set the payment amount with enhanced logging and guard condition analysis
 */
function setAmount(amount) {
    console.log('Setting amount to:', amount);
    const previousAmount = currentAmount;
    currentAmount = amount;

    // Update display
    const amountElement = document.getElementById('current-amount');
    if (amountElement) {
        amountElement.textContent = `$${amount.toLocaleString()}`;
    }

    // Enhanced logging with guard condition analysis
    logFlowSeparator('Amount Configuration');
    logFlowEntry('💰 Amount Change', `Updated from $${previousAmount.toLocaleString()} to $${amount.toLocaleString()}`);

    const guardAnalysis = analyzeGuardConditions(currentMethod, amount);
    if (guardAnalysis.triggered) {
        logFlowEntry('⚡ Guard Condition', `${guardAnalysis.condition} = TRUE`, 'guard');
        logFlowEntry('🔀 Processing Route', guardAnalysis.action, 'warning');
    } else {
        logFlowEntry('✅ Standard Processing', 'No guard conditions will be triggered');
    }
}

/**
 * Process the payment with comprehensive API response handling
 */
function processPayment() {
    console.log('Processing payment...', { method: currentMethod, amount: currentAmount });

    // Enhanced pre-processing logging
    logFlowSeparator('Payment Processing Started');
    logFlowEntry('🚀 Backend Call', 'Initiating payment processing request');
    logFlowEntry('📋 Request Data', `method: "${currentMethod}", amount: $${currentAmount.toLocaleString()}`);
    logFlowEntry('🌐 API Endpoint', 'POST /api/simple/payment');
    logFlowEntry('⏱️ Processing...', 'Measuring backend response time...');

    const processingStartTime = performance.now();

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
        const processingTime = Math.round(performance.now() - processingStartTime);
        logFlowEntry('📡 Response Received', `HTTP ${response.status} in ${processingTime}ms`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const totalTime = Math.round(performance.now() - processingStartTime);
        console.log('Enhanced API response received:', data);

        // === ENHANCED API RESPONSE HANDLING ===
        handleEnhancedApiResponse(data, totalTime);
    })
    .catch(error => {
        console.error('Error:', error);

        // Enhanced error logging
        logFlowSeparator('Processing Error');
        logFlowEntry('❌ Backend Error', 'Could not connect to Spring Boot application', 'error');
        logFlowEntry('🔧 Troubleshooting', 'Verify application is running on localhost:8080');
        logFlowEntry('📋 Error Details', error.message);

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
 * Handle the enhanced API response with comprehensive logging
 */
function handleEnhancedApiResponse(data, totalTime) {
    logFlowSeparator('Backend Processing Complete');

    // === BASIC RESULT LOGGING ===
    logFlowEntry('✅ Processing Result', `Status: ${data.status}`);
    logFlowEntry('💬 Result Message', data.message);

    // === CONTROLLER & SERVICE METHOD TRACKING ===
    if (data.controller_method) {
        logFlowEntry('🔴 Controller', data.controller_method);
    }
    if (data.service_method) {
        logFlowEntry('🟣 Service', data.service_method);
    }

    // === JAVA 21 METHODS USED ===
    if (data.java21_methods_used && data.java21_methods_used.length > 0) {
        logFlowEntry('🔥 Java 21 Methods', data.java21_methods_used.join(', '), 'java21');
    }

    // === PATTERN MATCHING DETAILS ===
    if (data.pattern_matched) {
        logFlowEntry('🎯 Pattern Matched', data.pattern_matched);
    }
    if (data.guard_condition) {
        logFlowEntry('⚡ Guard Condition', data.guard_condition, 'guard');
    }
    if (data.processing_action) {
        logFlowEntry('🔄 Action Taken', data.processing_action);
    }

    // === BUSINESS LOGIC & EDUCATIONAL INFO ===
    if (data.business_rule_applied) {
        logFlowEntry('📋 Business Rule', data.business_rule_applied);
    }
    if (data.pattern_matching_path) {
        logFlowEntry('🗺️  Pattern Path', data.pattern_matching_path);
    }
    if (data.performance_benefit) {
        logFlowEntry('⚡ Performance', data.performance_benefit);
    }

    // === JAVA 21 FEATURE INFO ===
    if (data.java21_feature) {
        logFlowEntry('🔥 Java 21 Feature', data.java21_feature, 'java21');
    }
    if (data.jep_reference) {
        logFlowEntry('📚 JEP Reference', data.jep_reference);
    }

    // === TIMING ===
    logFlowEntry('⏱️  Total Time', `${totalTime}ms end-to-end`);

    // === BUILD RESULT FOR DISPLAY ===
    const result = {
        status: data.status,
        message: data.message,
        pattern: data.java21_feature || 'Pattern Matching',
        color: getStatusColor(data.status),
        processingTime: totalTime,

        // Enhanced result data
        patternMatched: data.pattern_matched,
        guardCondition: data.guard_condition,
        processingAction: data.processing_action,
        businessRule: data.business_rule_applied
    };

    showResult(result);
}

/**
 * Show the processing result with enhanced visualization
 */
function showResult(result) {
    console.log('Showing enhanced result:', result);

    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    if (!resultSection || !resultContent) {
        console.error('Result elements not found!');
        return;
    }

    // Determine result section styling
    resultSection.className = 'result-section ' + getResultClass(result.status);

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

    // Final logging entry
    logFlowEntry('🎉 Demo Complete', `Result displayed: ${result.status}`);

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Enhanced logging function with flow visualization
 */
function logFlowEntry(action, details, type = 'info') {
    const log = document.getElementById('api-log');

    if (!log) {
        console.error('API log element not found!');
        console.log('Log entry would be:', action, details);
        return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const sessionTime = Math.round((Date.now() - demoStartTime) / 1000);
    logEntryCount++;

    // Create enhanced log entry
    const logEntry = document.createElement('div');
    logEntry.className = 'api-flow-block';

    let specialClass = '';
    let icon = '';

    switch(type) {
        case 'java21':
            specialClass = ' style="border-left-color: #10b981;"';
            icon = '🔥';
            break;
        case 'guard':
            specialClass = ' style="border-left-color: #f59e0b;"';
            icon = '⚡';
            break;
        case 'warning':
            specialClass = ' style="border-left-color: #f59e0b;"';
            icon = '⚠️';
            break;
        case 'error':
            specialClass = ' style="border-left-color: #ef4444;"';
            icon = '❌';
            break;
        default:
            icon = '📝';
    }

    logEntry.innerHTML = `
        <div${specialClass}><strong>${icon} ${action}</strong></div>
        <div class="api-flow-child">📋 ${details}</div>
        <div class="api-flow-child">⏰ ${timestamp} (+${sessionTime}s)</div>
        ${type === 'java21' ? '<div class="api-flow-child">🎯 <span class="java21-pattern-tag">Java 21</span></div>' : ''}
    `;

    // Insert at the top (most recent first)
    const firstChild = log.firstChild;
    log.insertBefore(logEntry, firstChild);

    // Limit log entries to prevent overflow
    while (log.children.length > 20) {
        log.removeChild(log.lastChild);
    }

    // Auto-scroll to top to show newest entry
    log.scrollTop = 0;
}

/**
 * Add flow separator for visual organization
 */
function logFlowSeparator(title) {
    const log = document.getElementById('api-log');
    if (!log) return;

    const separator = document.createElement('div');
    separator.style.cssText = `
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        margin: 12px 0;
        position: relative;
        text-align: center;
    `;
    separator.innerHTML = `
        <div style="
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            padding: 0 12px;
            font-size: 0.75rem;
            color: #f59e0b;
            font-weight: bold;
            border-radius: 12px;
            border: 1px solid rgba(245, 158, 11, 0.3);
        ">⚡ ${title} ⚡</div>
    `;

    log.insertBefore(separator, log.firstChild);
}

// === HELPER FUNCTIONS ===

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

function getResultClass(status) {
    if (status.includes('APPROVED')) return 'success';
    if (status.includes('REQUIRES')) return 'warning';
    if (status.includes('ERROR')) return 'error';
    return 'info';
}

function getStatusIcon(status) {
    if (status.includes('APPROVED')) return '✓';
    if (status.includes('REQUIRES')) return '!';
    if (status.includes('ERROR')) return '✗';
    return '?';
}

function clearLog() {
    const log = document.getElementById('api-log');
    if (log) {
        log.innerHTML = '';
        logEntryCount = 0;
        demoStartTime = Date.now();

        // Add clear confirmation
        logFlowEntry('🧹 Log Cleared', 'Visual flow inspector reset');
    }
}

console.log('🚀 Enhanced Simple Payment Demo JavaScript loaded');
console.log('🎯 Full API response handling with educational metadata');