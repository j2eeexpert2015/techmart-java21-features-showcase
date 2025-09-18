/**
 * Visual Flow Inspector - Complete Standalone JavaScript Component
 * Extracted from shopping-cart-demo.js with full backward compatibility
 *
 * MAINTAINS 100% COMPATIBILITY with existing shopping-cart-demo.html
 * All original functions and behaviors preserved exactly
 */

/* ================================
   ORIGINAL FUNCTIONS FROM SHOPPING-CART-DEMO.JS
   (PRESERVED EXACTLY FOR COMPATIBILITY)
   ================================ */

/**
 * ORIGINAL: Create initial flow log entry for API calls
 * Used by shopping cart demo - maintained exactly for compatibility
 *
 * @param {string} userAction - The user action that triggered the API call
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @returns {string} - Log entry ID for updating later
 */
function createFlowLog(userAction, method, endpoint) {
    const logContainer = document.getElementById('api-log');
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
 * Handles the enhanced API responses with educational metadata
 * PRESERVED EXACTLY from shopping-cart-demo.js
 *
 * @param {string} logId - The log entry ID to update
 * @param {Object} responseData - The response data from the backend
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

    // Handle multiple service calls (like shopping cart getCart)
    if (responseData.service_calls && typeof responseData.service_calls === 'object') {
        html += `<div class="api-flow-child">🟣 Service Layer: Multiple methods called</div>`;

        Object.entries(responseData.service_calls).forEach(([serviceMethod, java21Methods]) => {
            if (java21Methods && java21Methods.length > 0) {
                html += `<div class="api-flow-child">  └─ <strong>${serviceMethod}</strong> → <span class="java21-method-tag">${java21Methods.join(', ')}</span></div>`;
                java21Methods.forEach(method => highlightJavaMethod(method));
            } else {
                html += `<div class="api-flow-child">  └─ <strong>${serviceMethod}</strong> → Standard Collection API</div>`;
            }
        });
    }
    // Handle single service call
    else if (responseData.service_method) {
        html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;

        if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
            html += `<div class="api-flow-child">🔥 Java 21 Method: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
            responseData.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }
    }

    // Add operation description
    if (responseData.operation_description) {
        html += `<div class="api-flow-child">💡 Operation: ${responseData.operation_description}</div>`;
    }

    // Add performance benefit
    if (responseData.performance_benefit) {
        html += `<div class="api-flow-child">⚡ Performance: ${responseData.performance_benefit}</div>`;
    }

    // Add Java 21 feature info
    if (responseData.java21_feature) {
        html += `<div class="api-flow-child">🎯 Feature: ${responseData.java21_feature}</div>`;
    }

    flowBlock.querySelector('[data-role="controller"]').innerHTML = html;
}

/**
 * ORIGINAL: Bullet-proof highlight for API reference table
 * PRESERVED EXACTLY from shopping-cart-demo.js
 *
 * @param {string} methodName - The Java method to highlight
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
 * PRESERVED EXACTLY from shopping-cart-demo.js
 */
function clearInspectorLog() {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return;

    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
}

/* ================================
   ENHANCED FUNCTIONS FOR OTHER DEMOS
   (New functions that don't interfere with original)
   ================================ */

/**
 * Main API flow logging function - for enhanced demos
 * Does not interfere with original shopping cart functions
 *
 * @param {string} phase - The processing phase
 * @param {string} details - Details about this phase
 * @param {string} context - Additional context (optional)
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
    entry.style.marginBottom = '4px';
    entry.style.fontFamily = 'monospace';
    entry.style.fontSize = '12px';
    entry.style.lineHeight = '1.6';
    entry.style.paddingLeft = '8px';

    let content = '';

    // Handle different phases with consistent styling
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
        case 'Service Method':
            content = `<span style="color: #6b7280;">&nbsp;&nbsp;&nbsp;&nbsp;└── </span><span style="color: #fbbf24; font-weight: bold;">${details}</span> <span style="color: #6b7280;">– ${context}</span>`;
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
 * Enhanced logging function for payment and simple demos
 * Provides backward compatibility while using the standard logAPIFlow
 *
 * @param {string} action - The action being performed
 * @param {string} details - Details about the action
 * @param {string} type - Type of log entry (java21, guard, error, etc.)
 */
function logFlowEntry(action, details, type = 'info') {
    // Map the old format to the new standardized format
    switch(type) {
        case 'java21':
            logAPIFlow('Feature', details);
            break;
        case 'guard':
            logAPIFlow('Operation', `Guard condition: ${details}`);
            break;
        case 'error':
            logAPIFlow('Error', details);
            break;
        case 'warning':
            logAPIFlow('Operation', details);
            break;
        default:
            logAPIFlow('Operation', details);
    }
}

/**
 * Add visual separator for flow organization
 *
 * @param {string} title - Title for the separator
 */
function logFlowSeparator(title) {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return;

    const separator = document.createElement('div');
    separator.className = 'pattern-flow-separator';
    separator.setAttribute('data-title', `⚡ ${title} ⚡`);

    logContainer.insertBefore(separator, logContainer.firstChild);
}

/**
 * Initialize Visual Flow Inspector in enhanced mode (for payment/simple demos)
 *
 * @param {Object} options - Configuration options
 */
function initializeEnhancedFlowInspector(options = {}) {
    const logContainer = document.getElementById('api-log');
    if (logContainer) {
        logContainer.classList.add('enhanced');
    }

    console.log('🎯 Visual Flow Inspector initialized in enhanced mode');
}

/**
 * Handle enhanced API responses with comprehensive educational metadata
 * Used by payment and simple demos for detailed backend response logging
 *
 * @param {Object} data - API response data
 * @param {number} processingTime - Time taken for the request
 */
function handleEnhancedApiResponse(data, processingTime = 0) {
    logFlowSeparator('Backend Processing Complete');

    // Basic result logging
    logAPIFlow('Operation', `Processing Result: Status ${data.status}`);
    if (data.message || data.statusMessage) {
        logAPIFlow('Operation', `Result Message: ${data.message || data.statusMessage}`);
    }

    // Controller & Service method tracking
    if (data.controller_method) {
        logAPIFlow('Controller', data.controller_method);
    }
    if (data.service_method) {
        logAPIFlow('Service', data.service_method);
    }

    // Java 21 methods used
    if (data.java21_methods_used && data.java21_methods_used.length > 0) {
        logAPIFlow('Feature', `Java 21 Methods: ${data.java21_methods_used.join(', ')}`);
    }

    // Pattern matching details
    if (data.pattern_matched) {
        logAPIFlow('Operation', `Pattern Matched: ${data.pattern_matched}`);
    }
    if (data.guard_condition && data.guard_condition !== 'none') {
        logAPIFlow('Operation', `Guard Condition: ${data.guard_condition}`);
    }
    if (data.processing_action) {
        logAPIFlow('Operation', `Processing Action: ${data.processing_action}`);
    }

    // Business logic & educational info
    if (data.business_rule_applied) {
        logAPIFlow('Operation', `Business Rule: ${data.business_rule_applied}`);
    }
    if (data.pattern_matching_path) {
        logAPIFlow('Operation', `Pattern Path: ${data.pattern_matching_path}`);
    }
    if (data.performance_benefit) {
        logAPIFlow('Operation', `Performance: ${data.performance_benefit}`);
    }

    // Java 21 feature info
    if (data.java21_feature) {
        logAPIFlow('Feature', data.java21_feature);
    }
    if (data.jep_reference) {
        logAPIFlow('Feature', `JEP Reference: ${data.jep_reference}`);
    }

    // Timing
    if (processingTime > 0) {
        logAPIFlow('Operation', `Total Time: ${processingTime}ms end-to-end`);
    }
}

/* ================================
   VISUAL FLOW INSPECTOR CLASS
   (For advanced usage - doesn't interfere with original functions)
   ================================ */

/**
 * Visual Flow Inspector class for advanced usage
 * Optional - original functions work independently
 */
class VisualFlowInspector {
    constructor(containerId = 'api-log') {
        this.containerId = containerId;
        this.container = null;
        this.config = {
            maxEntries: 12,
            autoScroll: true,
            enhanced: false,
            showTimestamps: false
        };
        this.entryCount = 0;
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.warn(`VFI: Container with id '${this.containerId}' not found`);
            return false;
        }
        return true;
    }

    log(type, message, context = '') {
        logAPIFlow(type, message, context);
        this.entryCount++;
    }

    logJava21(method, description) {
        const logContainer = document.getElementById(this.containerId);
        if (!logContainer) return;

        const entry = document.createElement('div');
        entry.className = 'api-flow-block';
        entry.innerHTML = `
            <div>🔥 Java 21 Method: <span class="java21-method-tag">${method}</span></div>
            <div class="api-flow-child">💡 ${description}</div>
        `;

        logContainer.insertBefore(entry, logContainer.firstChild);
        this._limitEntries();
    }

    logPattern(pattern, guard, action) {
        const logContainer = document.getElementById(this.containerId);
        if (!logContainer) return;

        const entry = document.createElement('div');
        entry.className = 'api-flow-block';
        entry.innerHTML = `
            <div>🎯 Pattern Match: <span class="java21-pattern-tag">${pattern}</span></div>
            <div class="api-flow-child">⚡ Guard: ${guard}</div>
            <div class="api-flow-child">🔄 Action: ${action}</div>
        `;

        logContainer.insertBefore(entry, logContainer.firstChild);
        this._limitEntries();
    }

    logApi(endpoint, description) {
        const logContainer = document.getElementById(this.containerId);
        if (!logContainer) return;

        const entry = document.createElement('div');
        entry.className = 'api-flow-block';
        entry.innerHTML = `
            <div>🌐 API Call: <strong>${endpoint}</strong></div>
            <div class="api-flow-child">📋 ${description}</div>
        `;

        logContainer.insertBefore(entry, logContainer.firstChild);
        this._limitEntries();
    }

    separator(title) {
        logFlowSeparator(title);
    }

    clear() {
        clearInspectorLog();
        this.entryCount = 0;
    }

    setEnhanced(enabled) {
        if (!this.container) return;

        if (enabled) {
            this.container.classList.add('enhanced');
        } else {
            this.container.classList.remove('enhanced');
        }
        this.config.enhanced = enabled;
    }

    setAutoScroll(enabled) {
        this.config.autoScroll = enabled;
    }

    setMaxEntries(max) {
        this.config.maxEntries = Math.max(5, Math.min(20, max));
        this._limitEntries();
    }

    _limitEntries() {
        if (!this.container) return;

        while (this.container.children.length > this.config.maxEntries) {
            this.container.removeChild(this.container.lastChild);
        }

        if (this.config.autoScroll) {
            this.container.scrollTop = 0;
        }
    }
}

/* ================================
   BACKWARD COMPATIBILITY ALIASES
   ================================ */

// Aliases for backward compatibility with existing code
window.clearLog = clearInspectorLog; // For simple demos
window.logFlowEntry = logFlowEntry;   // For payment/simple demos
window.logFlowSeparator = logFlowSeparator;

/* ================================
   GLOBAL EXPORTS
   ================================ */

// Make functions available globally for all demos
window.VisualFlowInspector = VisualFlowInspector;
window.logAPIFlow = logAPIFlow;
window.createFlowLog = createFlowLog;
window.updateFlowLog = updateFlowLog;
window.clearInspectorLog = clearInspectorLog;
window.highlightJavaMethod = highlightJavaMethod;
window.initializeEnhancedFlowInspector = initializeEnhancedFlowInspector;
window.handleEnhancedApiResponse = handleEnhancedApiResponse;

// Create a simple global instance for easy usage
window.VFI = new VisualFlowInspector();

/* ================================
   INITIALIZATION
   ================================ */

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if container exists
    if (document.getElementById('api-log')) {
        window.VFI.init();
        console.log('🚀 Visual Flow Inspector component loaded and ready');
    }
});

/* ================================
   COMPATIBILITY NOTES
   ================================ */

/*
 * SHOPPING CART DEMO COMPATIBILITY:
 * - All original functions preserved exactly as they were:
 *   * createFlowLog()
 *   * updateFlowLog()
 *   * highlightJavaMethod()
 *   * clearInspectorLog()
 * - No changes to function signatures or behavior
 * - All existing shopping-cart-demo.js code will work unchanged
 *
 * USAGE IN SHOPPING CART DEMO:
 * Simply include this file instead of the original functions,
 * and shopping-cart-demo.html will work exactly as before.
 *
 * USAGE IN OTHER DEMOS:
 * Other demos can use the enhanced functions:
 * - logAPIFlow()
 * - logFlowEntry()
 * - logFlowSeparator()
 * - handleEnhancedApiResponse()
 * - VisualFlowInspector class
 * - window.VFI global instance
 */