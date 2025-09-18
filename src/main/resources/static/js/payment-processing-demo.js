/**
 * Payment Processing Demo - Java 21 Features Showcase
 * Visual Flow Inspector Integration
 *
 * Demonstrates JEP 441: Pattern Matching for switch with proper flow visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    initializePaymentDemo();
    setupDemoInteractions();
});

/**
 * Initialize the payment processing demo
 * Sets up the Visual Flow Inspector and demo functionality
 */
function initializePaymentDemo() {
    console.log('Initializing Payment Processing Demo...');

    // Initial flow render for pattern matching
    const initialFlow = fetchPaymentFlow();
    renderFlow(initialFlow);

    // Setup demo UI
    setupPaymentForm();
}

/**
 * Setup demo interactions (buttons, form events)
 */
function setupDemoInteractions() {
    // Process Payment button
    const processBtn = document.getElementById('process-payment');
    if (processBtn) {
        processBtn.addEventListener('click', handleProcessPayment);
    }

    // Run Pattern Match button
    const patternBtn = document.getElementById('run-pattern-match');
    if (patternBtn) {
        patternBtn.addEventListener('click', handlePatternMatch);
    }

    // Clear Flow button (handled by shared inspector)
    const clearBtn = document.querySelector('.clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFlow);
    }
}

/**
 * Fetch payment processing flow data
 * Returns hierarchical structure compatible with Visual Flow Inspector
 */
function fetchPaymentFlow() {
    return [
        {
            type: 'feature',
            label: 'JEP Reference: JEP 441: Pattern Matching for switch',
            color: 'green',
            children: []
        },
        {
            type: 'feature',
            label: 'Pattern Matching for Switch',
            color: 'green',
            children: [
                {
                    type: 'api',
                    label: 'Payment Processing API Call',
                    color: 'yellow'
                }
            ]
        },
        {
            type: 'operation',
            label: 'Performance: Type-safe pattern matching with automatic casting and exhaustive',
            color: 'orange',
            children: [
                {
                    type: 'path',
                    label: 'HighVolumeDomestic → Matched',
                    color: 'lightgreen'
                },
                {
                    type: 'path',
                    label: 'International → Casting Applied',
                    color: 'lightcoral'
                },
                {
                    type: 'path',
                    label: 'LowValue → Default Case',
                    color: 'lightgray'
                }
            ]
        },
        {
            type: 'operation',
            label: 'Pattern Match HighVolumeDomestic',
            color: 'orange',
            children: [
                {
                    type: 'feature',
                    label: 'Exhaustive Pattern Matching',
                    color: 'green'
                }
            ]
        },
        {
            type: 'feature',
            label: 'Type-Safe Processing Complete',
            color: 'green',
            children: []
        }
    ];
}

/**
 * Handle process payment button click
 * Simulates payment processing with pattern matching flow
 */
function handleProcessPayment(event) {
    event.preventDefault();

    // Get form data
    const formData = getPaymentFormData();
    console.log('Processing payment:', formData);

    // Simulate API call
    simulatePaymentProcessing(formData);

    // Update flow inspector with payment processing flow
    const paymentFlow = fetchPaymentFlow();
    renderFlow(paymentFlow);

    // Show success message
    showPaymentStatus('Payment processed successfully using pattern matching!');
}

/**
 * Handle pattern match demonstration
 * Shows specific pattern matching execution flow
 */
function handlePatternMatch(event) {
    event.preventDefault();

    // Generate pattern matching specific flow
    const matchFlow = [
        {
            type: 'feature',
            label: 'Pattern Matching Execution',
            color: 'green'
        },
        {
            type: 'operation',
            label: 'Switch Pattern Match: Payment Type Analysis',
            color: 'orange',
            children: [
                {
                    type: 'path',
                    label: 'Case: HighVolumeDomestic → Matched (Fast Path)',
                    color: 'lightgreen'
                },
                {
                    type: 'path',
                    label: 'Case: International → Type Casting Applied',
                    color: 'lightcoral'
                },
                {
                    type: 'path',
                    label: 'Case: LowValue → Default Processing',
                    color: 'lightgray'
                },
                {
                    type: 'path',
                    label: 'Exhaustive: All Cases Covered',
                    color: 'gold'
                }
            ]
        },
        {
            type: 'feature',
            label: 'Type-Safe Result Processing',
            color: 'green',
            children: []
        }
    ];

    renderFlow(matchFlow);

    // Show demo message
    showPatternMatchDemo('Pattern matching executed with exhaustive coverage!');
}

/**
 * Setup payment form functionality
 */
function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProcessPayment(e);
        });
    }
}

/**
 * Get payment form data
 */
function getPaymentFormData() {
    const form = document.getElementById('payment-form');
    if (!form) return {};

    const formData = new FormData(form);
    return {
        amount: formData.get('amount'),
        type: formData.get('payment-type'),
        country: formData.get('country'),
        timestamp: new Date().toISOString()
    };
}

/**
 * Simulate payment processing with pattern matching
 */
function simulatePaymentProcessing(data) {
    // Simulate different processing paths based on pattern matching
    console.log('Simulating pattern-based payment processing...');

    setTimeout(() => {
        // Mock API response
        const response = {
            success: true,
            transactionId: 'TXN-' + Date.now(),
            processingPath: determineProcessingPath(data),
            timestamp: new Date().toISOString()
        };

        console.log('Payment processed:', response);
        updatePaymentResult(response);
    }, 1000);
}

/**
 * Determine processing path based on pattern matching logic
 */
function determineProcessingPath(data) {
    const amount = parseFloat(data.amount);
    const type = data.type;
    const country = data.country;

    // Pattern matching simulation (Java 21 style)
    if (type === 'high-volume' && country === 'domestic' && amount > 1000) {
        return 'HighVolumeDomestic';
    } else if (type === 'international' && country !== 'domestic') {
        return 'International';
    } else if (amount < 50) {
        return 'LowValue';
    } else {
        return 'Standard';
    }
}

/**
 * Update payment result display
 */
function updatePaymentResult(result) {
    const resultDiv = document.getElementById('payment-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>Payment Successful!</h5>
                <p><strong>Transaction ID:</strong> ${result.transactionId}</p>
                <p><strong>Processing Path:</strong> ${result.processingPath}</p>
                <p><strong>Timestamp:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                <small>Java 21 Pattern Matching applied for optimal processing</small>
            </div>
        `;
    }
}

/**
 * Show payment status message
 */
function showPaymentStatus(message) {
    const statusDiv = document.getElementById('payment-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = 'alert alert-success';
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 5000);
    }
}

/**
 * Show pattern matching demo message
 */
function showPatternMatchDemo(message) {
    const demoDiv = document.getElementById('demo-status');
    if (demoDiv) {
        demoDiv.textContent = message;
        demoDiv.className = 'alert alert-info';
        setTimeout(() => {
            demoDiv.textContent = '';
            demoDiv.className = '';
        }, 5000);
    }
}

/**
 * Clear the Visual Flow Inspector
 * Uses shared inspector function
 */
function clearFlow() {
    const container = document.querySelector('.flow-container');
    if (container) {
        container.innerHTML = '';
    }
    console.log('Flow inspector cleared');
}

// Export functions for global access (if needed by shared inspector)
window.PaymentDemo = {
    fetchPaymentFlow,
    handleProcessPayment,
    handlePatternMatch,
    clearFlow
};