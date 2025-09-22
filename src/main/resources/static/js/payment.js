/**
 * FIXED Visual Flow Inspector - Full Functionality Restored
 */
(function() {
    'use strict';
    
    const VFI_CONFIG = {
        maxEntries: 12, // Restored original
        autoScroll: true,
        enhanced: true,
        containerId: 'api-log',
        showTimestamps: false,
        debugMode: false
    };
    
    function safeLog(message, ...args) {
        if (VFI_CONFIG.debugMode) {
            console.log(`[VFI] ${message}`, ...args);
        }
    }
    
    function getLogContainer() {
        return document.getElementById(VFI_CONFIG.containerId);
    }
    
    function clearInitialMessage(container) {
        const initialMessage = container.querySelector('.initial-vfi-message');
        if (initialMessage) {
            container.innerHTML = '';
        }
    }
    
    function maintainEntryLimit(container) {
        while (container.children.length > VFI_CONFIG.maxEntries) {
            container.removeChild(container.lastChild);
        }
    }
    
    /* ================================
       FIXED CORE FUNCTIONS
       ================================ */
    function createFlowLog(userAction, method, endpoint) {
        const logContainer = getLogContainer();
        if (!logContainer) {
            console.error('VFI: Container not found');
            return null;
        }
        
        clearInitialMessage(logContainer);
        
        const flowBlock = document.createElement('div');
        const logId = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        flowBlock.id = logId;
        flowBlock.className = VFI_CONFIG.enhanced ? 'api-flow-block enhanced' : 'api-flow-block';
        
        let timestamp = VFI_CONFIG.showTimestamps ? 
            ` <small style="opacity: 0.6;">[${new Date().toLocaleTimeString()}]</small>` : '';
        
        flowBlock.innerHTML = `
            <div>👤 <strong>${userAction}</strong> (Frontend)${timestamp}</div>
            <div class="api-flow-child">🌐 API Call: <strong>${method} ${endpoint}</strong></div>
            <div class="api-flow-child" data-role="controller">🔴 Controller: Pending...</div>
        `;
        
        logContainer.insertBefore(flowBlock, logContainer.firstChild);
        maintainEntryLimit(logContainer);
        
        if (VFI_CONFIG.autoScroll) {
            logContainer.scrollTop = 0;
        }
        
        safeLog('Created flow log:', logId);
        return logId;
    }
    
    function updateFlowLog(logId, responseData) {
        if (!logId) {
            console.warn('VFI: No logId provided');
            return;
        }
        
        const flowBlock = document.getElementById(logId);
        if (!flowBlock) {
            console.warn('VFI: Flow block not found:', logId);
            return;
        }
        
        const controllerElement = flowBlock.querySelector('[data-role="controller"]');
        if (!controllerElement) {
            console.warn('VFI: Controller element not found');
            return;
        }
        
        // Handle errors
        if (responseData.error) {
            controllerElement.innerHTML = `🔴 Controller: <span style="color: #ef4444;">ERROR: ${responseData.error}</span>`;
            safeLog('VFI Error update:', responseData.error);
            return;
        }
        
        let html = `🔴 Controller: <strong>${responseData.controller_method || 'Controller Method'}</strong>`;
        
        // Handle service calls (shopping cart style)
        if (responseData.service_calls && typeof responseData.service_calls === 'object') {
            html += `<div class="api-flow-child">🟣 Service Layer: Multiple methods called</div>`;
            Object.entries(responseData.service_calls).forEach(([serviceMethod, java21Methods]) => {
                if (java21Methods && java21Methods.length > 0) {
                    html += `<div class="api-flow-child"> └─ <strong>${serviceMethod}</strong> → <span class="java21-method-tag">${java21Methods.join(', ')}</span></div>`;
                    java21Methods.forEach(method => highlightJavaMethod(method));
                } else {
                    html += `<div class="api-flow-child"> └─ <strong>${serviceMethod}</strong> → Standard API</div>`;
                }
            });
        }
        // Handle single service call (payment style)
        else if (responseData.service_method) {
            html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;
            
            if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
                html += `<div class="api-flow-child">🔥 Java 21: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
                responseData.java21_methods_used.forEach(method => highlightJavaMethod(method));
            }
            
            if (responseData.pattern_matched) {
                html += `<div class="api-flow-child">🎯 Pattern: <strong>${responseData.pattern_matched}</strong></div>`;
            }
            if (responseData.guard_condition && responseData.guard_condition !== 'none') {
                html += `<div class="api-flow-child">⚡ Guard: <strong>${responseData.guard_condition}</strong></div>`;
            }
            if (responseData.processing_action) {
                html += `<div class="api-flow-child">🔄 Action: <strong>${responseData.processing_action}</strong></div>`;
            }
        }
        
        // Add metadata
        if (responseData.operation_description) {
            html += `<div class="api-flow-child">💡 <em>${responseData.operation_description}</em></div>`;
        }
        if (responseData.business_rule_applied) {
            html += `<div class="api-flow-child">📋 Rule: ${responseData.business_rule_applied}</div>`;
        }
        if (responseData.performance_benefit) {
            html += `<div class="api-flow-child">⚡ Perf: ${responseData.performance_benefit}</div>`;
        }
        
        controllerElement.innerHTML = html;
        safeLog('VFI Updated flow:', logId, responseData);
    }
    
    function clearInspectorLog() {
        const logContainer = getLogContainer();
        if (!logContainer) return;
        
        logContainer.innerHTML = `
            <div class="text-muted text-center py-2 initial-vfi-message">
                <i class="fas fa-play-circle mb-2 play-circle-icon"></i>
                <div>Select payment method and process payment to see Java 21 pattern matching flow</div>
                <small class="text-muted">Pattern matching visualization ready</small>
            </div>
        `;
        safeLog('VFI cleared');
    }
    
    /* ================================
       FIXED HIGHLIGHTING FUNCTION
       ================================ */
    function highlightJavaMethod(methodName) {
        if (!methodName) {
            console.warn('VFI: No method name for highlighting');
            return;
        }
        
        // Clear previous highlights
        document.querySelectorAll('.api-ref-row').forEach(row => {
            row.classList.remove('highlight-pattern', 'highlight-switch', 'highlight-guard', 'highlight-sealed');
        });
        
        // Normalize method name
        const safeMethod = String(methodName).replace(/\(\)$/, '').toLowerCase();
        const rowIdMap = {
            'switch (payment)': 'pattern-switch',
            'creditcard': 'pattern-creditcard',
            'creditcard(...)': 'pattern-creditcard',
            'paypal': 'pattern-paypal',
            'paypal(...)': 'pattern-paypal',
            'banktransfer': 'pattern-banktransfer',
            'banktransfer(...)': 'pattern-banktransfer',
            'when amount > 1000': 'pattern-guard',
            'sealed interface': 'pattern-sealed'
        };
        
        const targetRowId = rowIdMap[safeMethod] || `pattern-${safeMethod}`;
        const targetRow = document.getElementById(targetRowId);
        
        if (!targetRow) {
            safeLog('VFI: Row not found for method:', targetRowId);
            return;
        }
        
        // Determine highlight class based on method type
        let highlightClass = 'highlight-pattern';
        if (safeMethod.includes('switch')) highlightClass = 'highlight-switch';
        else if (safeMethod.includes('guard') || safeMethod.includes('when')) highlightClass = 'highlight-guard';
        else if (safeMethod.includes('sealed')) highlightClass = 'highlight-sealed';
        
        // Apply highlighting
        targetRow.classList.add(highlightClass);
        
        // Log to VFI
        window.logAPIFlow('Feature', `Highlighted: ${methodName}`);
        
        // Auto-clear after animation
        setTimeout(() => {
            if (targetRow.isConnected) {
                targetRow.classList.remove(highlightClass);
            }
        }, 4000);
        
        safeLog('VFI: Highlighted method:', methodName, targetRowId);
    }
    
    /* ================================
       ENHANCED LOGGING FUNCTIONS
       ================================ */
    function logAPIFlow(phase, details, context = '') {
        const logContainer = getLogContainer();
        if (!logContainer) {
            console.warn('VFI: Container not found for logAPIFlow');
            return;
        }
        
        clearInitialMessage(logContainer);
        
        const entry = document.createElement('div');
        entry.className = VFI_CONFIG.enhanced ? 'api-flow-block enhanced' : 'api-flow-block';
        
        let content = '';
        let timestamp = VFI_CONFIG.showTimestamps ? 
            ` <small style="opacity: 0.6;">[${new Date().toLocaleTimeString()}]</small>` : '';
        
        switch(phase) {
            case 'Initial Processing':
                content = `<span style="color: #a855f7;">📋</span> <span style="color: #fbbf24; font-weight: bold;">${details}</span> ${context ? `<span style="color: #9ca3af;">(${context})</span>` : ''}${timestamp}`;
                break;
            case 'API Call':
                content = `<span style="color: #06b6d4;">🌐</span> API Call: <span style="color: #fbbf24;">${details}</span>${timestamp}`;
                break;
            case 'Controller':
                content = `<span style="color: #ef4444;">●</span> Controller: <span style="color: #fbbf24; font-weight: bold;">${details}</span>${timestamp}`;
                break;
            case 'Service':
                content = `<span style="color: #8b5cf6;">●</span> Service: <span style="color: #f3f4f6;">${details}</span>${timestamp}`;
                break;
            case 'Operation':
                content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #f59e0b;">●</span> Operation: <span style="color: #f3f4f6;">${details}</span>${timestamp}`;
                break;
            case 'Feature':
                content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #10b981;">●</span> Feature: <span style="color: #f3f4f6;">${details}</span>${timestamp}`;
                break;
            case 'Response':
                content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #34d399;">●</span> Response: <span style="color: #f3f4f6;">${details}</span>${timestamp}`;
                break;
            default:
                content = `<span style="color: #6b7280;">●</span> <span style="color: #f3f4f6;">${details}</span>${timestamp}`;
        }
        
        entry.innerHTML = content;
        logContainer.insertBefore(entry, logContainer.firstChild);
        maintainEntryLimit(logContainer);
        
        if (VFI_CONFIG.autoScroll) {
            logContainer.scrollTop = 0;
        }
        
        safeLog('VFI API flow logged:', phase, details);
    }
    
    function addSeparator(title = 'Processing Flow') {
        const logContainer = getLogContainer();
        if (!logContainer) return;
        
        const separator = document.createElement('div');
        separator.className = 'pattern-flow-separator';
        separator.setAttribute('data-title', title);
        logContainer.insertBefore(separator, logContainer.firstChild);
        maintainEntryLimit(logContainer);
        
        safeLog('VFI Separator added:', title);
    }
    
    function handleEnhancedApiResponse(data, processingTime = 0) {
        addSeparator('Backend Processing Complete');
        
        if (data.status) logAPIFlow('Response', `Status: ${data.status}`);
        if (data.message) logAPIFlow('Response', `Message: ${data.message}`);
        if (data.controller_method) logAPIFlow('Controller', data.controller_method);
        if (data.service_method) logAPIFlow('Service', data.service_method);
        
        if (data.java21_methods_used && data.java21_methods_used.length > 0) {
            logAPIFlow('Feature', `Java 21: ${data.java21_methods_used.join(', ')}`);
            data.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }
        
        if (data.pattern_matched) logAPIFlow('Operation', `Pattern: ${data.pattern_matched}`);
        if (data.guard_condition && data.guard_condition !== 'none') logAPIFlow('Operation', `Guard: ${data.guard_condition}`);
        if (data.processing_action) logAPIFlow('Operation', `Action: ${data.processing_action}`);
        if (data.business_rule_applied) logAPIFlow('Operation', `Rule: ${data.business_rule_applied}`);
        if (data.performance_benefit) logAPIFlow('Operation', `Performance: ${data.performance_benefit}`);
        
        if (processingTime > 0) logAPIFlow('Operation', `Time: ${processingTime}ms`);
        
        safeLog('VFI Enhanced response handled:', data);
    }
    
    /* ================================
       CONFIGURATION
       ================================ */
    function setEnhanced(enabled) {
        VFI_CONFIG.enhanced = enabled;
        const container = getLogContainer();
        if (container) {
            if (enabled) container.classList.add('enhanced');
            else container.classList.remove('enhanced');
        }
    }
    
    function setMaxEntries(max) {
        VFI_CONFIG.maxEntries = Math.max(5, Math.min(20, max));
    }
    
    function initializeEnhancedFlowInspector(options = {}) {
        Object.assign(VFI_CONFIG, options);
        setEnhanced(true);
        safeLog('VFI Enhanced mode initialized');
    }
    
    /* ================================
       VFI NAMESPACE
       ================================ */
    window.VFI = {
        createFlowLog,
        updateFlowLog,
        clearInspectorLog,
        highlightJavaMethod,
        logAPIFlow,
        handleEnhancedApiResponse,
        addSeparator,
        setEnhanced,
        setMaxEntries,
        initializeEnhancedFlowInspector,
        getConfig: () => ({ ...VFI_CONFIG })
    };
    
    // Global functions for backward compatibility
    window.createFlowLog = createFlowLog;
    window.updateFlowLog = updateFlowLog;
    window.clearInspectorLog = clearInspectorLog;
    window.highlightJavaMethod = highlightJavaMethod;
    window.logAPIFlow = logAPIFlow;
    window.handleEnhancedApiResponse = handleEnhancedApiResponse;
    window.initializeEnhancedFlowInspector = initializeEnhancedFlowInspector;
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            safeLog('Visual Flow Inspector - FIXED and ready');
            console.log('✅ VFI: Full functionality restored');
            console.log('🎯 Try: VFI.createFlowLog("Test", "GET", "/api/test")');
        });
    } else {
        safeLog('VFI: Already loaded');
    }
})();

/**
 * FIXED Payment Demo - Full VFI Integration
 */
let selectedPaymentMethod = 'creditcard';
let selectedCustomerType = 'basic';
let currentAmount = 3996.00;
let isInternationalCard = false;
let demoSpeed = 1.0;

// Initialize VFI
window.initializeEnhancedFlowInspector({
    maxEntries: 12,
    autoScroll: true,
    enhanced: true,
    showTimestamps: false
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FIXED Payment Demo initializing...');
    initializeFixedDemo();
    setupEventListeners();
    console.log('✅ Demo ready - VFI and API Reference fully functional');
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    console.log('Setting up FIXED event listeners...');
    
    // Quick test buttons
    document.querySelectorAll('[data-amount]').forEach(button => {
        const amount = parseInt(button.getAttribute('data-amount'));
        button.addEventListener('click', () => testWithAmount(amount));
    });
    
    // Main buttons
    document.getElementById('process-payment-btn').addEventListener('click', processPayment);
    document.getElementById('reset-demo-btn').addEventListener('click', resetDemo);
    document.getElementById('scenarios-btn').addEventListener('click', showDemoScenarios);
    document.getElementById('clear-log-btn').addEventListener('click', () => {
        window.clearInspectorLog();
        logActivity('VFI cleared by user');
    });
    
    // Instructions modal
    document.getElementById('toggle-instructions-btn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('instructionsModal'));
        modal.show();
    });
    
    // Payment method cards
    document.querySelectorAll('.payment-method-card-compact').forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this);
        });
    });
    
    // Customer type
    document.querySelectorAll('input[name="customerType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedCustomerType = this.value;
                updatePatternMatchingLogic(selectedPaymentMethod);
                logActivity(`Customer type changed to: ${this.value}`);
                console.log('Customer type:', selectedCustomerType);
            }
        });
    });
    
    // International toggle
    const internationalToggle = document.getElementById('international-card');
    if (internationalToggle) {
        internationalToggle.addEventListener('change', function() {
            isInternationalCard = this.checked;
            updateGuardConditionWarning();
            updatePatternMatchingLogic(selectedPaymentMethod);
            logActivity(`International ${this.checked ? 'enabled' : 'disabled'}`);
        });
    }
    
    // Demo speed
    const speedSlider = document.getElementById('demoSpeed');
    const speedLabel = document.getElementById('speedLabel');
    if (speedSlider && speedLabel) {
        speedSlider.addEventListener('input', function(e) {
            demoSpeed = parseFloat(e.target.value);
            const labels = { 0.5: 'Slow', 1: 'Normal', 1.5: 'Fast', 2: 'Very Fast' };
            speedLabel.textContent = labels[demoSpeed] || 'Normal';
        });
    }
    
    // Scenarios
    document.querySelectorAll('[data-scenario]').forEach(button => {
        button.addEventListener('click', function() {
            runScenario(this.getAttribute('data-scenario'));
        });
    });
    
    initializeTooltips();
    console.log('✅ All event listeners set up');
}

/**
 * Initialize fixed demo
 */
function initializeFixedDemo() {
    // Initialize VFI with proper height
    const vfiContainer = document.getElementById('api-log');
    if (vfiContainer) {
        vfiContainer.classList.add('vfi-optimized-height');
    }
    
    updateAmountDisplay();
    logActivity('Demo initialized - VFI ready');
    
    // Set initial pattern status
    updatePatternMatchingLogic('creditcard');
    
    console.log('📐 FIXED Layout:');
    console.log('- Header: 100px');
    console.log('- Instructions: 35px (modal)');
    console.log('- VFI: 160px (optimized)');
    console.log('- Right tabs: 120px each');
    console.log('- Left tabs: 320px');
    console.log('- Total: ~735px < 100vh ✓');
}

/**
 * FIXED Payment method selection
 */
function selectPaymentMethod(selectedCard) {
    const method = selectedCard.dataset.method;
    if (!method) {
        console.error('No method found');
        return;
    }
    
    // Update UI
    document.querySelectorAll('.payment-method-card-compact').forEach(card => {
        card.classList.remove('selected');
    });
    selectedCard.classList.add('selected');
    selectedPaymentMethod = method;
    
    console.log('🔥 Payment method selected:', method);
    
    // Log to VFI
    window.logAPIFlow('Initial Processing', `Payment method selection: ${getMethodDisplayName(method)}`);
    window.logAPIFlow('Feature', `Pattern preparation: case ${method.charAt(0).toUpperCase() + method.slice(1)}(...) ->`);
    
    // Update displays
    highlightApiReference(method);
    setTimeout(() => updatePatternMatchingLogic(method), 200);
    updateGuardConditionWarning();
    
    logActivity(`${getMethodDisplayName(method)} selected`);
}

/**
 * FIXED API Reference highlighting
 */
function highlightApiReference(method) {
    console.log('🎯 Highlighting API reference for:', method);
    
    // Clear previous highlights
    document.querySelectorAll('.api-ref-row').forEach(row => {
        row.classList.remove('highlight-pattern', 'highlight-switch', 'highlight-guard', 'highlight-sealed');
    });
    
    const patterns = {
        'creditcard': ['pattern-switch', 'pattern-creditcard', 'pattern-guard'],
        'paypal': ['pattern-switch', 'pattern-paypal', 'pattern-sealed'],
        'banktransfer': ['pattern-switch', 'pattern-banktransfer', 'pattern-guard']
    };
    
    if (patterns[method]) {
        window.logAPIFlow('Feature', `Highlighting ${patterns[method].length} patterns`);
        
        patterns[method].forEach((patternId, index) => {
            setTimeout(() => {
                const row = document.getElementById(patternId);
                if (row) {
                    const highlightClass = `highlight-${patternId.split('-')[1]}`;
                    row.classList.add(highlightClass);
                    window.logAPIFlow('Feature', `Highlighted: ${patternId}`);
                }
            }, index * 300);
        });
        
        // Clear after 5 seconds
        setTimeout(() => {
            patterns[method].forEach(patternId => {
                const row = document.getElementById(patternId);
                if (row) {
                    row.classList.remove('highlight-pattern', 'highlight-switch', 'highlight-guard', 'highlight-sealed');
                }
            });
            window.logAPIFlow('Operation', 'API highlighting cleared');
        }, 5000);
    }
}

/**
 * FIXED Pattern matching logic update
 */
function updatePatternMatchingLogic(method) {
    const statusContainer = document.getElementById('pattern-status');
    if (!statusContainer) return;
    
    const guardAnalysis = analyzeGuardConditions(method);
    const steps = statusContainer.querySelectorAll('.status-step-optimized');
    
    // Step 1: Payment Method Detection
    if (steps[0]) {
        const text = steps[0].querySelector('div:last-child');
        text.innerHTML = `
            <div class="fw-bold small">Payment Method Detection</div>
            <small class="text-muted">Pattern: ${getMethodDisplayName(method)} identified</small>
        `;
        window.logAPIFlow('Operation', `Payment method detected: ${getMethodDisplayName(method)}`);
    }
    
    // Step 2: Guard Condition Check
    if (steps[1]) {
        const icon = steps[1].querySelector('.status-icon');
        const text = steps[1].querySelector('div:last-child');
        
        if (guardAnalysis.triggered) {
            icon.className = 'status-icon status-warning';
            icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            text.innerHTML = `
                <div class="fw-bold small">Guard Condition Check</div>
                <small class="text-muted">⚡ ${guardAnalysis.description}</small>
            `;
            window.logAPIFlow('Feature', `Guard triggered: ${guardAnalysis.condition}`);
        } else {
            icon.className = 'status-icon status-complete';
            icon.innerHTML = '<i class="fas fa-check"></i>';
            text.innerHTML = `
                <div class="fw-bold small">Guard Condition Check</div>
                <small class="text-muted">✅ ${guardAnalysis.description}</small>
            `;
            window.logAPIFlow('Operation', 'No guard conditions triggered');
        }
    }
    
    // Step 3: Validation
    if (steps[2]) {
        const text = steps[2].querySelector('div:last-child');
        text.innerHTML = `
            <div class="fw-bold small">Validation</div>
            <small class="text-muted">Ready for processing with ${getMethodDisplayName(method)}</small>
        `;
    }
}

/**
 * FIXED Guard condition analysis
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
                    description: 'High-value international → Additional verification required'
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
        description: 'No guard conditions → Standard processing'
    };
}

/**
 * Update guard warning
 */
function updateGuardConditionWarning() {
    const warning = document.getElementById('guard-condition-warning');
    if (!warning) return;
    
    const guardAnalysis = analyzeGuardConditions(selectedPaymentMethod);
    
    if (guardAnalysis.triggered && selectedPaymentMethod === 'creditcard' &&
        currentAmount > 1000 && isInternationalCard) {
        warning.classList.add('visible');
        window.logAPIFlow('Operation', 'Guard warning displayed: High-value international transaction');
    } else {
        warning.classList.remove('visible');
    }
}

/**
 * FIXED Payment processing
 */
function processPayment() {
    console.log('🔥 Processing payment with FIXED VFI...');
    showProcessingState();
    
    // VFI logging
    window.logAPIFlow('Initial Processing', 'Payment processing initiated', 
        `${getMethodDisplayName(selectedPaymentMethod)} - $${currentAmount.toLocaleString()}`);
    window.logAPIFlow('API Call', 'POST /api/payment/process');
    
    const logId = window.createFlowLog('Process Payment', 'POST', '/api/payment/process');
    
    // Apply demo speed
    const delay = 1500 / demoSpeed;
    
    setTimeout(() => {
        const mockResponse = {
            status: 'APPROVED',
            message: 'Payment processed successfully using Java 21 pattern matching',
            controller_method: 'PaymentController.processPayment',
            service_method: 'PaymentService.processWithPatternMatching',
            java21_methods_used: [
                'switch (payment)', 
                `${selectedPaymentMethod === 'creditcard' ? 'CreditCard' : selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}(...)`,
                'when amount > 1000'
            ],
            pattern_matched: `case ${selectedPaymentMethod === 'creditcard' ? 'CreditCard' : selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}(_)`,
            guard_condition: analyzeGuardConditions(selectedPaymentMethod).condition,
            processing_action: analyzeGuardConditions(selectedPaymentMethod).action,
            operation_description: 'Pattern matching routed payment through appropriate business logic path',
            business_rule_applied: 'PCI-DSS compliance and fraud detection completed',
            performance_benefit: 'O(1) pattern matching vs O(n) instanceof chains',
            java21_feature: 'JEP 440: Record Patterns with Guards',
            jep_reference: 'JEP 405, 409, 440',
            processingTime: Math.floor(Math.random() * 500) + 200
        };
        
        // Update VFI
        window.updateFlowLog(logId, mockResponse);
        window.handleEnhancedApiResponse(mockResponse, mockResponse.processingTime);
        
        // Update UI
        handleSuccessfulPayment(mockResponse);
        hideProcessingState();
        
        logActivity(`Payment processed: ${mockResponse.status} (${mockResponse.processingTime}ms)`);
        
        console.log('✅ Payment completed with full VFI integration');
        
    }, delay);
}

function showProcessingState() {
    const button = document.getElementById('process-payment-btn');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing Payment...';
    }
}

function hideProcessingState() {
    const button = document.getElementById('process-payment-btn');
    if (button) {
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-lock me-1"></i>Process Payment - <span id="button-amount">$${currentAmount.toLocaleString()}</span>`;
    }
}

function handleSuccessfulPayment(data) {
    // Update pattern status to complete
    const steps = document.querySelectorAll('.status-step-optimized');
    steps.forEach((step, index) => {
        const icon = step.querySelector('.status-icon');
        icon.className = 'status-icon status-complete';
        icon.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            step.style.background = 'linear-gradient(90deg, #d4edda, #c3e6cb)';
            step.style.borderLeft = '4px solid #28a745';
        }, index * 150);
    });
    
    // Update final step
    if (steps[3]) {
        const text = steps[3].querySelector('div:last-child');
        text.innerHTML = `
            <div class="fw-bold small">Payment Processing</div>
            <small class="text-success">✓ ${data.status}: ${data.message}</small>
        `;
    }
    
    showSuccessNotification(data);
    window.logAPIFlow('Response', `Payment completed: ${data.status} ✓`);
}

function testWithAmount(amount) {
    console.log(`Testing with amount: $${amount.toLocaleString()}`);
    currentAmount = amount;
    updateAmountDisplay();
    updateGuardConditionWarning();
    
    window.logAPIFlow('Operation', `Amount changed to: $${amount.toLocaleString()}`, 'Quick test button');
    logActivity(`Amount set to: $${amount.toLocaleString()}`);
    
    // Auto-process after short delay
    setTimeout(() => processPayment(), 500 / demoSpeed);
}

function updateAmountDisplay() {
    const elements = [
        document.getElementById('total-amount'),
        document.getElementById('button-amount'),
        document.getElementById('total-amount-detailed')
    ].filter(el => el);
    
    elements.forEach(el => {
        el.textContent = `$${currentAmount.toLocaleString()}`;
    });
}

/**
 * Activity logging
 */
function logActivity(message) {
    const activityContainer = document.getElementById('activity-container');
    if (!activityContainer) return;
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item-optimized';
    activityItem.innerHTML = `
        <small class="text-muted">${time}</small>
        <span class="d-block small">${message}</span>
    `;
    
    activityContainer.insertBefore(activityItem, activityContainer.firstChild);
    
    // Keep last 5 items
    while (activityContainer.children.length > 5) {
        activityContainer.removeChild(activityContainer.lastChild);
    }
    
    activityContainer.scrollTop = 0;
}

function resetDemo() {
    console.log('🔄 Resetting demo...');
    
    window.logAPIFlow('Operation', 'Demo reset to initial state');
    logActivity('Demo reset to initial state');
    
    selectedPaymentMethod = 'creditcard';
    selectedCustomerType = 'basic';
    currentAmount = 3996.00;
    isInternationalCard = false;
    demoSpeed = 1.0;
    
    // Reset UI
    document.querySelectorAll('.payment-method-card-compact').forEach((card, index) => {
        card.classList.remove('selected');
        if (index === 0) card.classList.add('selected'); // Credit card
    });
    
    document.querySelectorAll('input[name="customerType"]').forEach(radio => radio.checked = false);
    document.getElementById('customer-basic').checked = true;
    document.getElementById('international-card').checked = false;
    
    document.getElementById('demoSpeed').value = 1;
    document.getElementById('speedLabel').textContent = 'Normal';
    
    updateAmountDisplay();
    window.clearInspectorLog();
    resetPatternStatus();
    updateGuardConditionWarning();
    
    showInfoNotification('Demo reset complete');
}

function resetPatternStatus() {
    const steps = document.querySelectorAll('.status-step-optimized');
    
    if (steps[0]) {
        steps[0].querySelector('.status-icon').className = 'status-icon status-complete';
        steps[0].querySelector('.status-icon').innerHTML = '<i class="fas fa-check"></i>';
    }
    
    if (steps[1]) {
        steps[1].querySelector('.status-icon').className = 'status-icon status-active';
        steps[1].querySelector('.status-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    
    if (steps[2]) {
        steps[2].querySelector('.status-icon').className = 'status-icon status-pending';
        steps[2].querySelector('.status-icon').innerHTML = '<i class="fas fa-clock"></i>';
    }
    
    if (steps[3]) {
        steps[3].querySelector('.status-icon').className = 'status-icon status-pending';
        steps[3].querySelector('.status-icon').innerHTML = '<i class="fas fa-clock"></i>';
    }
}

function showDemoScenarios() {
    const modal = new bootstrap.Modal(document.getElementById('scenariosModal'));
    modal.show();
    logActivity('Demo scenarios opened');
}

function runScenario(scenarioName) {
    console.log('Running scenario:', scenarioName);
    const modal = bootstrap.Modal.getInstance(document.getElementById('scenariosModal'));
    if (modal) modal.hide();
    
    window.logAPIFlow('Initial Processing', `Automated scenario: ${scenarioName}`);
    logActivity(`Running scenario: ${scenarioName}`);
    
    resetDemo();
    
    switch (scenarioName) {
        case 'high-value-international':
            selectedPaymentMethod = 'creditcard';
            currentAmount = 1500;
            isInternationalCard = true;
            logActivity('Scenario: High-value international setup');
            break;
        case 'premium-paypal':
            selectedPaymentMethod = 'paypal';
            selectedCustomerType = 'premium';
            currentAmount = 1000;
            logActivity('Scenario: Premium PayPal setup');
            break;
        case 'large-bank-transfer':
            selectedPaymentMethod = 'banktransfer';
            currentAmount = 6000;
            logActivity('Scenario: Large bank transfer setup');
            break;
        case 'all-patterns':
            // Cycle through all - simplified for demo
            selectedPaymentMethod = 'paypal';
            currentAmount = 2000;
            logActivity('Scenario: All patterns test');
            break;
    }
    
    updateUIForScenario();
    setTimeout(() => processPayment(), 1000 / demoSpeed);
}

function updateUIForScenario() {
    // Update payment method
    document.querySelectorAll('.payment-method-card-compact').forEach(card => {
        card.classList.remove('selected');
    });
    const methodCard = document.querySelector(`[data-method="${selectedPaymentMethod}"]`);
    if (methodCard) methodCard.classList.add('selected');
    
    // Update customer type
    document.querySelectorAll('input[name="customerType"]').forEach(radio => radio.checked = false);
    const customerRadio = document.getElementById(`customer-${selectedCustomerType}`);
    if (customerRadio) customerRadio.checked = true;
    
    // Update international
    document.getElementById('international-card').checked = isInternationalCard;
    
    updateAmountDisplay();
    updateGuardConditionWarning();
    updatePatternMatchingLogic(selectedPaymentMethod);
}

/**
 * Notifications
 */
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-${getToastIcon(type)} me-2 text-${type}"></i>
                <strong class="me-auto text-${type}">${title}</strong>
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
    
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
}

function showSuccessNotification(data) {
    showToast('Payment Success', `Status: ${data.status} - ${data.message}`, 'success');
}

function showInfoNotification(message) {
    showToast('Info', message, 'info');
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getMethodDisplayName(method) {
    const names = {
        'creditcard': 'Credit Card',
        'paypal': 'PayPal',
        'banktransfer': 'Bank Transfer'
    };
    return names[method] || method;
}

function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Global API
window.PaymentDemo = {
    processPayment,
    resetDemo,
    testWithAmount,
    runScenario,
    showDemoScenarios,
    getCurrentState: () => ({
        method: selectedPaymentMethod,
        customerType: selectedCustomerType,
        amount: currentAmount,
        international: isInternationalCard,
        speed: demoSpeed
    }),
    logToVFI: window.logAPIFlow,
    clearVFI: window.clearInspectorLog,
    highlightMethod: window.highlightJavaMethod,
    vfiConfig: window.VFI.getConfig
};

console.log('🚀 FIXED Demo loaded successfully!');
console.log('✅ VFI: Full functionality restored with proper highlighting');
console.log('✅ API Reference: All animations and interactions working');
console.log('📐 Layout: 735px total height - fully visible');
console.log('🎮 Test commands:');
console.log('- PaymentDemo.testWithAmount(1500)');
console.log('- PaymentDemo.processPayment()');
console.log('- window.VFI.createFlowLog("Test", "GET", "/api")');