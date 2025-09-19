/**
 * Visual Flow Inspector - Fixed Standalone JavaScript Component
 * FIXED: Resolved all function conflicts and compatibility issues
 * MAINTAINS 100% COMPATIBILITY with existing shopping-cart-demo.html
 */

/* ================================
   ORIGINAL FUNCTIONS FROM SHOPPING-CART-DEMO.JS
   (COPIED EXACTLY - THESE ARE THE WORKING VERSIONS)
   ================================ */

/**
 * FIXED: Create initial flow log entry for API calls
 * This is the EXACT working version from shopping-cart-demo.js
 */
function createFlowLog(userAction, method, endpoint) {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return null;

    // Clear initial message if present
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
 * FIXED: Update flow log with backend response data
 * This is the EXACT working version from shopping-cart-demo.js
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

    // === HANDLE MULTIPLE SERVICE CALLS (like shopping cart getCart) ===
    if (responseData.service_calls && typeof responseData.service_calls === 'object') {
        html += `<div class="api-flow-child">🟣 Service Layer: Multiple methods called</div>`;

        // Show each service method call
        Object.entries(responseData.service_calls).forEach(([serviceMethod, java21Methods]) => {
            if (java21Methods && java21Methods.length > 0) {
                html += `<div class="api-flow-child">  └─ <strong>${serviceMethod}</strong> → <span class="java21-method-tag">${java21Methods.join(', ')}</span></div>`;
                // Highlight corresponding methods in API reference
                java21Methods.forEach(method => highlightJavaMethod(method));
            } else {
                html += `<div class="api-flow-child">  └─ <strong>${serviceMethod}</strong> → Standard Collection API</div>`;
            }
        });
    }
    // === HANDLE SINGLE SERVICE CALL (payment/simple demos) ===
    else if (responseData.service_method) {
        html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;

        if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
            html += `<div class="api-flow-child">🔥 Java 21 Method: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
            responseData.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }

        // Pattern matching details (for payment demos)
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

    // === ADD OPERATION DESCRIPTION ===
    if (responseData.operation_description) {
        html += `<div class="api-flow-child">💡 Operation: ${responseData.operation_description}</div>`;
    }

    // === ADD BUSINESS RULE ===
    if (responseData.business_rule_applied) {
        html += `<div class="api-flow-child">📋 Business Rule: ${responseData.business_rule_applied}</div>`;
    }

    // === ADD PERFORMANCE BENEFIT ===
    if (responseData.performance_benefit) {
        html += `<div class="api-flow-child">⚡ Performance: ${responseData.performance_benefit}</div>`;
    }

    // === ADD JAVA 21 FEATURE INFO ===
    if (responseData.java21_feature) {
        html += `<div class="api-flow-child">🎯 Feature: ${responseData.java21_feature}</div>`;

        if (responseData.jep_reference) {
            html += `<div class="api-flow-child">📚 JEP: ${responseData.jep_reference}</div>`;
        }
    }

    flowBlock.querySelector('[data-role="controller"]').innerHTML = html;
}

/**
 * FIXED: API Reference table highlighting
 * This is the EXACT working version from shopping-cart-demo.js
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
 * FIXED: Clear the Visual Flow Inspector log
 * This is the EXACT working version from shopping-cart-demo.js
 */
function clearInspectorLog() {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return;

    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
}

/* ================================
   ENHANCED FUNCTIONS FOR PAYMENT/SIMPLE DEMOS
   (No conflicts - these are additional functions)
   ================================ */

/**
 * Enhanced API flow logging for payment/simple demos
 * Uses a different function name to avoid conflicts
 */
function logAPIFlow(phase, details, context = '') {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) {
        console.warn('API log container not found');
        return;
    }

    // Clear initial message if present
    if (logContainer.querySelector('.text-muted')) {
        logContainer.innerHTML = '';
    }

    const entry = document.createElement('div');
    entry.className = 'api-flow-block';

    let content = '';
    switch(phase) {
        case 'Initial Processing':
            content = `<span style="color: #a855f7;">📋</span> <span style="color: #fbbf24; font-weight: bold;">${details}</span> <span style="color: #9ca3af;">(${context})</span>`;
            break;
        case 'API Call':
            content = `<span style="color: #06b6d4;">🌐</span> API Call: <span style="color: #fbbf24;">${details}</span>`;
            break;
        case 'Controller':
            content = `<span style="color: #ef4444;">●</span> Controller: <span style="color: #fbbf24; font-weight: bold;">${details}</span>`;
            break;
        case 'Service':
            content = `<span style="color: #8b5cf6;">●</span> Service: <span style="color: #f3f4f6;">${details}</span>`;
            break;
        case 'Operation':
            content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #f59e0b;">●</span> Operation: <span style="color: #f3f4f6;">${details}</span>`;
            break;
        case 'Feature':
            content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #10b981;">●</span> Feature: <span style="color: #f3f4f6;">${details}</span>`;
            break;
        default:
            content = `<span style="color: #6b7280;">●</span> <span style="color: #f3f4f6;">${details}</span>`;
    }

    entry.innerHTML = content;
    logContainer.insertBefore(entry, logContainer.firstChild);

    // Limit entries to prevent overflow
    while (logContainer.children.length > 12) {
        logContainer.removeChild(logContainer.lastChild);
    }

    logContainer.scrollTop = 0;
}

/**
 * Enhanced logging function with comprehensive API response handling
 * Used by payment and simple demos for detailed backend response logging
 */
function handleEnhancedApiResponse(data, processingTime = 0) {
    // Add separator
    const logContainer = document.getElementById('api-log');
    if (logContainer) {
        const separator = document.createElement('div');
        separator.className = 'pattern-flow-separator';
        separator.setAttribute('data-title', '⚡ Backend Processing Complete ⚡');
        logContainer.insertBefore(separator, logContainer.firstChild);
    }

    // Log comprehensive response data
    logAPIFlow('Operation', `Processing Result: Status ${data.status}`);

    if (data.message || data.statusMessage) {
        logAPIFlow('Operation', `Result Message: ${data.message || data.statusMessage}`);
    }

    if (data.controller_method) {
        logAPIFlow('Controller', data.controller_method);
    }

    if (data.service_method) {
        logAPIFlow('Service', data.service_method);
    }

    if (data.java21_methods_used && data.java21_methods_used.length > 0) {
        logAPIFlow('Feature', `Java 21 Methods: ${data.java21_methods_used.join(', ')}`);
    }

    if (data.pattern_matched) {
        logAPIFlow('Operation', `Pattern Matched: ${data.pattern_matched}`);
    }

    if (data.guard_condition && data.guard_condition !== 'none') {
        logAPIFlow('Operation', `Guard Condition: ${data.guard_condition}`);
    }

    if (data.processing_action) {
        logAPIFlow('Operation', `Processing Action: ${data.processing_action}`);
    }

    if (data.business_rule_applied) {
        logAPIFlow('Operation', `Business Rule: ${data.business_rule_applied}`);
    }

    if (data.pattern_matching_path) {
        logAPIFlow('Operation', `Pattern Path: ${data.pattern_matching_path}`);
    }

    if (data.performance_benefit) {
        logAPIFlow('Operation', `Performance: ${data.performance_benefit}`);
    }

    if (data.java21_feature) {
        logAPIFlow('Feature', data.java21_feature);
    }

    if (data.jep_reference) {
        logAPIFlow('Feature', `JEP Reference: ${data.jep_reference}`);
    }

    if (processingTime > 0) {
        logAPIFlow('Operation', `Total Time: ${processingTime}ms end-to-end`);
    }
}

/* ================================
   ADDITIONAL UTILITY FUNCTIONS
   ================================ */

/**
 * Initialize enhanced mode for payment/simple demos
 */
function initializeEnhancedFlowInspector(options = {}) {
    const logContainer = document.getElementById('api-log');
    if (logContainer) {
        logContainer.classList.add('enhanced');
    }
    console.log('🎯 Visual Flow Inspector initialized in enhanced mode');
}

/* ================================
   GLOBAL EXPORTS
   ================================ */

// Make all functions globally available
window.createFlowLog = createFlowLog;
window.updateFlowLog = updateFlowLog;
window.highlightJavaMethod = highlightJavaMethod;
window.clearInspectorLog = clearInspectorLog;
window.logAPIFlow = logAPIFlow;
window.handleEnhancedApiResponse = handleEnhancedApiResponse;
window.initializeEnhancedFlowInspector = initializeEnhancedFlowInspector;

// Aliases for backward compatibility
window.clearLog = clearInspectorLog; // For simple demos

console.log('🚀 Fixed Visual Flow Inspector loaded successfully');
console.log('✅ All function conflicts resolved');
console.log('🔧 Shopping cart compatibility maintained');
console.log('🎯 Enhanced functions available for other demos');