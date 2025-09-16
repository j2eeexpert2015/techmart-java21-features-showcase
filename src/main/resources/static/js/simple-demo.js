/**
 * Enhanced Simple Payment Demo - JavaScript with Advanced Logging
 * Location: src/main/resources/static/js/simple-demo.js
 * Full Page Layout with Enhanced Visual Flow Inspector
 */

// Global Variables
let currentMethod = 'creditcard';
let currentAmount = 500;
let demoStartTime = Date.now();
let logEntryCount = 0;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing enhanced demo...'); // Debug log
    initializeDemo();
});

/**
 * Initialize the enhanced demo
 */
function initializeDemo() {
    console.log('Initializing enhanced demo...'); // Debug log
    setupPaymentMethodSelection();

    // Clear initial log and show welcome
    clearLog();
    logFlowEntry('🚀 Demo Initialization', 'Enhanced Simple Pattern Demo started');
    logFlowEntry('🎯 Java 21 Ready', 'Pattern matching switch expressions loaded');
    logFlowEntry('📋 Instructions', 'Select payment method → Choose amount → Process payment');

    // Update pattern preview
    updatePatternPreview(currentMethod);
    updateProcessingStatus('Ready to process');

    console.log('✅ Enhanced demo initialized successfully');
}

/**
 * Setup payment method selection handlers with enhanced logging
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
 * Handle payment method selection with enhanced logging
 */
function selectPaymentMethod(selectedCard) {
    const method = selectedCard.dataset.method;
    console.log('Selecting payment method:', method); // Debug log

    // Remove selected class from all cards
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected class to clicked card with animation
    selectedCard.classList.add('selected');

    // Update current method
    currentMethod = method;

    // Enhanced logging with flow visualization
    logFlowSeparator('Payment Method Selection');
    logFlowEntry('👤 User Action', `Selected ${getMethodName(method)} payment method`);
    logFlowEntry('🎯 Pattern Match', `switch(paymentMethod) case "${method}"`);
    logFlowEntry('🔥 Java 21 Feature', 'Pattern Matching for Switch', 'java21');
    logFlowEntry('📊 Business Logic', getPatternDescription(method));

    // Update pattern preview
    updatePatternPreview(method);
    updateProcessingStatus(`${getMethodName(method)} selected - Ready to process`);
}

/**
 * Set the payment amount with enhanced logging
 */
function setAmount(amount) {
    console.log('Setting amount to:', amount); // Debug log
    const previousAmount = currentAmount;
    currentAmount = amount;

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
        logFlowEntry('✅ Standard Processing', 'No guard conditions triggered');
    }

    updateProcessingStatus(`Amount: $${amount.toLocaleString()} - ${guardAnalysis.description}`);
}

/**
 * Process the payment with comprehensive logging
 */
function processPayment() {
    console.log('Processing payment...', { method: currentMethod, amount: currentAmount });

    // Update status and show processing
    updateProcessingStatus('Processing payment...');

    // Enhanced pre-processing logging
    logFlowSeparator('Payment Processing Started');
    logFlowEntry('🚀 Backend Call', `Initiating payment processing request`);
    logFlowEntry('📋 Request Payload', `{ method: "${currentMethod}", amount: ${currentAmount} }`);
    logFlowEntry('🌐 API Endpoint', 'POST /api/simple/payment');
    logFlowEntry('⏱️ Processing Time', 'Measuring backend response time...');

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

        // Enhanced success logging
        logFlowSeparator('Backend Processing Complete');
        logFlowEntry('✅ Processing Result', `Status: ${data.status}`);
        logFlowEntry('💬 Result Message', data.message);
        logFlowEntry('🔥 Java 21 Feature', data.java21_feature, 'java21');
        logFlowEntry('⏱️ Total Time', `${totalTime}ms end-to-end`);
        logFlowEntry('🎯 Pattern Match', `Backend switch expression executed successfully`);

        const result = {
            status: data.status,
            message: data.message,
            pattern: data.java21_feature,
            color: data.status.includes('APPROVED') ? '#10b981' : (data.status.includes('ERROR') ? '#ef4444' : '#f59e0b'),
            processingTime: totalTime
        };

        showResult(result);
        updateProcessingStatus(`Completed: ${data.status}`);
    })
    .catch(error => {
        console.error('Error:', error);

        // Enhanced error logging
        logFlowSeparator('Processing Error');
        logFlowEntry('❌ Backend Error', 'Could not connect to Spring Boot application');
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
        updateProcessingStatus('Connection error - Check backend');
    });
}

/**
 * Show the processing result with enhanced visualization
 */
function showResult(result) {
    console.log('Showing enhanced result:', result); // Debug log

    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    if (!resultSection || !resultContent) {
        console.error('Result elements not found!'); // Debug log
        return;
    }

    // Create enhanced result HTML
    resultContent.innerHTML = `
        <div style="border-left: 4px solid ${result.color}; padding-left: 15px;">
            <h4 style="color: ${result.color}; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 8px; height: 8px; background: ${result.color}; border-radius: 50%; animation: statusPulse 2s infinite;"></span>
                ${result.status}
            </h4>
            <p style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.4;">${result.message}</p>
            <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 6px; margin: 10px 0;">
                <small style="color: #666; font-style: italic; display: block;">
                    <strong>Java 21 Feature:</strong> ${result.pattern}
                </small>
                ${result.processingTime > 0 ? `<small style="color: #666; display: block; margin-top: 4px;">
                    <strong>Processing Time:</strong> ${result.processingTime}ms
                </small>` : ''}
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
        console.error('API log element not found!'); // Debug log
        console.log('Log entry would be:', action, details); // Fallback debug log
        return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const sessionTime = Math.round((Date.now() - demoStartTime) / 1000);
    logEntryCount++;

    // Create enhanced log entry
    const logEntry = document.createElement('div');
    logEntry.className = 'api-flow-block';

    let statusIcon = '';
    let specialClass = '';

    switch(type) {
        case 'java21':
            statusIcon = '<span class="status-indicator status-success"></span>';
            specialClass = ' style="border-left-color: #10b981;"';
            break;
        case 'guard':
            statusIcon = '<span class="status-indicator status-warning"></span>';
            specialClass = ' style="border-left-color: #f59e0b;"';
            break;
        case 'warning':
            statusIcon = '<span class="status-indicator status-processing"></span>';
            specialClass = ' style="border-left-color: #f59e0b;"';
            break;
        case 'error':
            statusIcon = '<span class="status-indicator status-error"></span>';
            specialClass = ' style="border-left-color: #ef4444;"';
            break;
        default:
            statusIcon = '<span class="status-indicator status-success"></span>';
    }

    logEntry.innerHTML = `
        <div${specialClass}>${statusIcon}<strong>${action}</strong></div>
        <div class="api-flow-child">📋 ${details}</div>
        <div class="api-flow-child">⏰ ${timestamp} (+${sessionTime}s)</div>
        ${type === 'java21' ? '<div class="api-flow-child">🔥 Feature: <span class="java21-pattern-tag">Java 21</span></div>' : ''}
    `;

    // Insert at the top (most recent first)
    const firstChild = log.firstChild;
    log.insertBefore(logEntry, firstChild);

    // Limit log entries to prevent overflow
    while (log.children.length > 15) {
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
    separator.className = 'pattern-flow-separator';

    // Update the separator content
    const separatorContent = document.createElement('div');
    separatorContent.style.cssText = 'border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 8px 0; position: relative;';
    separatorContent.innerHTML = `<div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #1e293b; padding: 0 8px; font-size: 9px; color: #f59e0b; font-weight: bold;">⚡ ${title} ⚡</div>`;

    log.insertBefore(separatorContent, log.firstChild);
}

/**
 * Analyze guard conditions for educational feedback
 */
function analyzeGuardConditions(method, amount) {
    switch(method) {
        case 'creditcard':
            if (amount > 1000) {
                return {
                    triggered: true,
                    condition: 'amount > 1000',
                    action: 'requiresVerification()',
                    description: 'High-value transaction - additional verification'
                };
            }
            break;
        case 'bank':
            if (amount >= 5000) {
                return {
                    triggered: true,
                    condition: 'amount >= 5000',
                    action: 'requiresManagerApproval()',
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

/**
 * Update pattern preview code
 */
function updatePatternPreview(method) {
    const preview = document.getElementById('pattern-preview');
    if (!preview) return;

    const patterns = {
        'creditcard': 'case "creditcard" -> processStandardCard();',
        'paypal': 'case "paypal" -> processPayPalAccount();',
        'bank': 'case "bank" -> processBankTransfer();'
    };

    preview.textContent = patterns[method] || patterns['creditcard'];
}

/**
 * Update processing status indicator
 */
function updateProcessingStatus(status) {
    const statusElement = document.getElementById('processing-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

/**
 * Clear the enhanced API log
 */
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
        'creditcard': 'CreditCard pattern with amount-based guard conditions',
        'paypal': 'PayPal pattern with account verification logic',
        'bank': 'BankTransfer pattern with approval workflow routing'
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

/**
 * Enhanced demo helper functions
 */

// Auto-demo functionality for educational purposes
function runAutoDemo() {
    logFlowSeparator('Auto Demo Started');
    logFlowEntry('🤖 Auto Demo', 'Running automated pattern matching demonstration');

    setTimeout(() => {
        selectPaymentMethodByName('paypal');
        setTimeout(() => {
            setAmount(1500);
            setTimeout(() => {
                processPayment();
            }, 1000);
        }, 1000);
    }, 1000);
}

function selectPaymentMethodByName(methodName) {
    const card = document.querySelector(`[data-method="${methodName}"]`);
    if (card) {
        selectPaymentMethod(card);
    }
}

// Add keyboard shortcuts for power users
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                selectPaymentMethodByName('creditcard');
                break;
            case '2':
                event.preventDefault();
                selectPaymentMethodByName('paypal');
                break;
            case '3':
                event.preventDefault();
                selectPaymentMethodByName('bank');
                break;
            case 'Enter':
                event.preventDefault();
                processPayment();
                break;
            case 'l':
                event.preventDefault();
                clearLog();
                break;
        }
    }
});

// Add demo statistics tracking
let demoStats = {
    paymentsProcessed: 0,
    methodsUsed: new Set(),
    totalProcessingTime: 0,
    lastProcessedAt: null
};

function updateDemoStats(method, processingTime) {
    demoStats.paymentsProcessed++;
    demoStats.methodsUsed.add(method);
    demoStats.totalProcessingTime += processingTime;
    demoStats.lastProcessedAt = new Date();
}

function showDemoStats() {
    const avgTime = demoStats.paymentsProcessed > 0 ?
        Math.round(demoStats.totalProcessingTime / demoStats.paymentsProcessed) : 0;

    logFlowSeparator('Demo Statistics');
    logFlowEntry('📊 Payments Processed', demoStats.paymentsProcessed.toString());
    logFlowEntry('🎯 Methods Used', Array.from(demoStats.methodsUsed).join(', '));
    logFlowEntry('⏱️ Average Time', `${avgTime}ms`);
    logFlowEntry('🕒 Last Processed', demoStats.lastProcessedAt ? demoStats.lastProcessedAt.toLocaleTimeString() : 'Never');
}

// Add educational tooltips and help
function showPatternMatchingHelp() {
    logFlowSeparator('Pattern Matching Help');
    logFlowEntry('📚 Java 21 Switch', 'Enhanced switch expressions with pattern matching');
    logFlowEntry('🔀 Guard Conditions', 'when clauses add business logic to patterns');
    logFlowEntry('🎯 Exhaustive Matching', 'Compiler ensures all cases are handled');
    logFlowEntry('🚀 Performance', 'Optimized pattern matching at runtime');
}

// Initialize enhanced features
function initializeEnhancedFeatures() {
    // Add demo controls
    console.log('🎯 Enhanced features initialized');
    console.log('⌨️ Keyboard shortcuts: Ctrl+1/2/3 (select method), Ctrl+Enter (process), Ctrl+L (clear log)');

    // Show keyboard shortcuts in log
    setTimeout(() => {
        logFlowEntry('⌨️ Shortcuts Available', 'Ctrl+1/2/3 (methods), Ctrl+Enter (process), Ctrl+L (clear)');
        logFlowEntry('📚 Help Available', 'Use showPatternMatchingHelp() in console for Java 21 info');
    }, 2000);
}

// Call enhanced initialization
setTimeout(initializeEnhancedFeatures, 1000);

// Make functions available globally for console access
window.DemoControls = {
    runAutoDemo,
    showDemoStats,
    showPatternMatchingHelp,
    clearLog,
    setAmount,
    selectPaymentMethodByName,
    processPayment
};

console.log('🚀 Enhanced Simple Demo JavaScript loaded');
console.log('🎮 Demo controls available via window.DemoControls');
console.log('📊 Try: DemoControls.runAutoDemo() or DemoControls.showPatternMatchingHelp()');