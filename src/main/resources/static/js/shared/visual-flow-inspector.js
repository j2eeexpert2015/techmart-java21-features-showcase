/**
 * Visual Flow Inspector - Complete Fixed Standalone JavaScript Component
 * RESOLVED: All function conflicts, compatibility issues, and missing features
 * MAINTAINS: 100% backward compatibility with existing shopping-cart-demo.html
 * ENHANCED: Support for payment/simple demos with additional features
 */

(function() {
    'use strict';

    // Global configuration with safe defaults
    const VFI_CONFIG = {
        maxEntries: 12,
        autoScroll: true,
        enhanced: false,
        containerId: 'api-log',
        showTimestamps: false,
        debugMode: false
    };

    // Utility function for safe logging
    function safeLog(message, ...args) {
        if (VFI_CONFIG.debugMode) {
            console.log(`[VFI] ${message}`, ...args);
        }
    }

    // Utility function to get container safely
    function getLogContainer() {
        const container = document.getElementById(VFI_CONFIG.containerId);
        if (!container) {
            console.warn(`VFI: Container with ID '${VFI_CONFIG.containerId}' not found`);
        }
        return container;
    }

    // Utility function to clear initial message
    function clearInitialMessage(container) {
        const initialMessages = container.querySelectorAll('.text-muted, .text-center');
        initialMessages.forEach(msg => {
            if (msg.textContent && (
                msg.textContent.includes('Click') ||
                msg.textContent.includes('Select') ||
                msg.textContent.includes('Log cleared') ||
                msg.textContent.includes('ready')
            )) {
                container.innerHTML = '';
            }
        });
    }

    // Utility function to maintain entry limit
    function maintainEntryLimit(container) {
        while (container.children.length > VFI_CONFIG.maxEntries) {
            container.removeChild(container.lastChild);
        }
    }

    /* ================================
       CORE FUNCTIONS (Shopping Cart Compatible)
       ================================ */

    /**
     * Create initial flow log entry for API calls
     * FIXED: Works with shopping cart demo exactly as before
     */
    function createFlowLog(userAction, method, endpoint) {
        const logContainer = getLogContainer();
        if (!logContainer) {
            console.error('VFI: Cannot create flow log - container not found');
            return null;
        }

        // Clear initial message if present
        clearInitialMessage(logContainer);

        const flowBlock = document.createElement('div');
        const logId = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        flowBlock.id = logId;
        flowBlock.className = VFI_CONFIG.enhanced ? 'api-flow-block enhanced' : 'api-flow-block';

        let timestamp = '';
        if (VFI_CONFIG.showTimestamps) {
            timestamp = ` <small style="opacity: 0.6;">[${new Date().toLocaleTimeString()}]</small>`;
        }

        flowBlock.innerHTML = `
            <div>👤 <strong>${userAction}</strong> (Frontend)${timestamp}</div>
            <div class="api-flow-child">🌐 API Call: ${method} ${endpoint}</div>
            <div class="api-flow-child" data-role="controller">🔴 Controller: Pending...</div>
        `;

        logContainer.insertBefore(flowBlock, logContainer.firstChild);

        // Maintain entry limit
        maintainEntryLimit(logContainer);

        if (VFI_CONFIG.autoScroll) {
            logContainer.scrollTop = 0;
        }

        safeLog('Created flow log:', logId, { userAction, method, endpoint });
        return logId;
    }

    /**
     * Update flow log with backend response data
     * FIXED: Handles both shopping cart style (service_calls) and payment style (single service)
     */
    function updateFlowLog(logId, responseData) {
        if (!logId) {
            console.warn('VFI: Cannot update flow log - no logId provided');
            return;
        }

        const flowBlock = document.getElementById(logId);
        if (!flowBlock) {
            console.warn('VFI: Flow block not found:', logId);
            return;
        }

        const controllerElement = flowBlock.querySelector('[data-role="controller"]');
        if (!controllerElement) {
            console.warn('VFI: Controller element not found in flow block');
            return;
        }

        // Handle error responses
        if (responseData.error) {
            controllerElement.innerHTML = `🔴 Controller: <span style="color: #ef4444;">${responseData.error}</span>`;
            safeLog('Updated flow log with error:', logId, responseData.error);
            return;
        }

        let html = `🔴 Controller: <strong>${responseData.controller_method || 'Controller Method'}</strong>`;

        // === HANDLE MULTIPLE SERVICE CALLS (Shopping Cart Style) ===
        if (responseData.service_calls && typeof responseData.service_calls === 'object') {
            html += `<div class="api-flow-child">🟣 Service Layer: Multiple methods called</div>`;

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
        // === HANDLE SINGLE SERVICE CALL (Payment/Simple Demo Style) ===
        else if (responseData.service_method) {
            html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;

            if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
                html += `<div class="api-flow-child">🔥 Java 21: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
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

        // === ADD COMMON METADATA ===
        if (responseData.operation_description) {
            html += `<div class="api-flow-child">💡 Operation: ${responseData.operation_description}</div>`;
        }
        if (responseData.business_rule_applied) {
            html += `<div class="api-flow-child">📋 Business Rule: ${responseData.business_rule_applied}</div>`;
        }
        if (responseData.performance_benefit) {
            html += `<div class="api-flow-child">⚡ Performance: ${responseData.performance_benefit}</div>`;
        }
        if (responseData.java21_feature) {
            html += `<div class="api-flow-child">🎯 Feature: ${responseData.java21_feature}</div>`;
        }
        if (responseData.jep_reference) {
            html += `<div class="api-flow-child">📚 JEP: ${responseData.jep_reference}</div>`;
        }

        controllerElement.innerHTML = html;
        safeLog('Updated flow log:', logId, responseData);
    }

    /**
     * Clear the Visual Flow Inspector log
     * FIXED: Works consistently across all demos
     */
    function clearInspectorLog() {
        const logContainer = getLogContainer();
        if (!logContainer) return;

        logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
        safeLog('Inspector log cleared');
    }

    /**
     * Highlight Java method in API reference table
     * FIXED: Robust highlighting with proper cleanup
     */
    function highlightJavaMethod(methodName) {
        if (!methodName) {
            console.warn('VFI: No method name provided for highlighting');
            return;
        }

        // Normalize method name
        const safe = String(methodName).replace(/\(\)$/, '');

        // Clear previous highlights
        document.querySelectorAll('tr[data-highlight="1"]').forEach(row => {
            const cells = Array.from(row.cells);
            cells.forEach(cell => {
                cell.style.removeProperty('box-shadow');
                cell.style.removeProperty('background-color');
                cell.style.removeProperty('border-top');
                cell.style.removeProperty('border-bottom');
                cell.style.removeProperty('border-left');
                cell.style.removeProperty('border-right');
            });
            row.removeAttribute('data-highlight');
        });

        // Find target row
        const row = document.getElementById(`code-${safe}`);
        if (!row) {
            safeLog('Method row not found:', `code-${safe}`);
            return;
        }

        // Apply highlighting
        const cells = Array.from(row.cells);
        const bg = getComputedStyle(document.documentElement)
            .getPropertyValue('--method-highlight-bg').trim() || '#fffbea';
        const border = getComputedStyle(document.documentElement)
            .getPropertyValue('--method-highlight-border').trim() || '#ffc107';

        cells.forEach((cell, i) => {
            cell.style.setProperty('box-shadow', `inset 0 0 0 9999px ${bg}`, 'important');
            cell.style.setProperty('background-color', 'transparent', 'important');
            cell.style.setProperty('border-top', `2px solid ${border}`, 'important');
            cell.style.setProperty('border-bottom', `2px solid ${border}`, 'important');
            if (i === 0) cell.style.setProperty('border-left', `2px solid ${border}`, 'important');
            if (i === cells.length - 1) cell.style.setProperty('border-right', `2px solid ${border}`, 'important');
        });

        row.setAttribute('data-highlight', '1');

        // Auto-remove highlighting
        setTimeout(() => {
            if (row.isConnected) {
                cells.forEach(cell => {
                    cell.style.removeProperty('box-shadow');
                    cell.style.removeProperty('background-color');
                    cell.style.removeProperty('border-top');
                    cell.style.removeProperty('border-bottom');
                    cell.style.removeProperty('border-left');
                    cell.style.removeProperty('border-right');
                });
                row.removeAttribute('data-highlight');
            }
        }, 2000);

        safeLog('Highlighted method:', methodName);
    }

    /* ================================
       ENHANCED FUNCTIONS (Payment/Simple Demo Style)
       ================================ */

    /**
     * Enhanced API flow logging for payment/simple demos
     * NEW: Simplified logging for modern demos
     */
    function logAPIFlow(phase, details, context = '') {
        const logContainer = getLogContainer();
        if (!logContainer) {
            console.warn('VFI: Log container not found for logAPIFlow');
            return;
        }

        // Clear initial message
        clearInitialMessage(logContainer);

        const entry = document.createElement('div');
        entry.className = VFI_CONFIG.enhanced ? 'api-flow-block enhanced' : 'api-flow-block';

        let content = '';
        let timestamp = '';
        if (VFI_CONFIG.showTimestamps) {
            timestamp = ` <small style="opacity: 0.6;">[${new Date().toLocaleTimeString()}]</small>`;
        }

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

        safeLog('API flow logged:', phase, details);
    }

    /**
     * Add separator line to log
     * NEW: Visual separation for different processing phases
     */
    function addSeparator(title = 'Processing Flow') {
        const logContainer = getLogContainer();
        if (!logContainer) return;

        const separator = document.createElement('div');
        separator.className = 'pattern-flow-separator';
        separator.setAttribute('data-title', title);
        logContainer.insertBefore(separator, logContainer.firstChild);

        maintainEntryLimit(logContainer);
        safeLog('Added separator:', title);
    }

    /**
     * Handle comprehensive API responses from enhanced backends
     * NEW: Automatic parsing of educational metadata
     */
    function handleEnhancedApiResponse(data, processingTime = 0) {
        // Add separator for enhanced demos
        addSeparator('Backend Processing Complete');

        if (data.status) {
            logAPIFlow('Response', `Status: ${data.status}`);
        }
        if (data.message || data.statusMessage) {
            logAPIFlow('Response', `Message: ${data.message || data.statusMessage}`);
        }
        if (data.controller_method) {
            logAPIFlow('Controller', data.controller_method);
        }
        if (data.service_method) {
            logAPIFlow('Service', data.service_method);
        }
        if (data.java21_methods_used && data.java21_methods_used.length > 0) {
            logAPIFlow('Feature', `Java 21: ${data.java21_methods_used.join(', ')}`);
            data.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }
        if (data.pattern_matched) {
            logAPIFlow('Operation', `Pattern: ${data.pattern_matched}`);
        }
        if (data.guard_condition && data.guard_condition !== 'none') {
            logAPIFlow('Operation', `Guard: ${data.guard_condition}`);
        }
        if (data.processing_action) {
            logAPIFlow('Operation', `Action: ${data.processing_action}`);
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
            logAPIFlow('Operation', `Processing Time: ${processingTime}ms`);
        }

        safeLog('Enhanced API response handled:', data);
    }

    /* ================================
       CONFIGURATION FUNCTIONS
       ================================ */

    /**
     * Set enhanced mode
     */
    function setEnhanced(enabled) {
        VFI_CONFIG.enhanced = enabled;
        const container = getLogContainer();
        if (container) {
            if (enabled) {
                container.classList.add('enhanced');
            } else {
                container.classList.remove('enhanced');
            }
        }
        safeLog('Enhanced mode:', enabled);
    }

    /**
     * Set maximum entries
     */
    function setMaxEntries(max) {
        VFI_CONFIG.maxEntries = Math.max(5, Math.min(50, max));
        safeLog('Max entries set to:', VFI_CONFIG.maxEntries);
    }

    /**
     * Set auto scroll behavior
     */
    function setAutoScroll(enabled) {
        VFI_CONFIG.autoScroll = enabled;
        safeLog('Auto scroll:', enabled);
    }

    /**
     * Set timestamp display
     */
    function setShowTimestamps(enabled) {
        VFI_CONFIG.showTimestamps = enabled;
        safeLog('Show timestamps:', enabled);
    }

    /**
     * Set debug mode
     */
    function setDebugMode(enabled) {
        VFI_CONFIG.debugMode = enabled;
        safeLog('Debug mode:', enabled);
    }

    /**
     * Initialize enhanced mode with options
     */
    function initializeEnhancedFlowInspector(options = {}) {
        Object.assign(VFI_CONFIG, options);
        setEnhanced(true);
        safeLog('Enhanced mode initialized with options:', options);
    }

    /* ================================
       NAMESPACE OBJECT
       ================================ */

    // Create VFI namespace object for modern access
    const VFI = {
        // Core functions (shopping cart compatibility)
        createFlowLog,
        updateFlowLog,
        clearInspectorLog,
        highlightJavaMethod,

        // Enhanced functions (payment/simple demos)
        logAPIFlow,
        handleEnhancedApiResponse,
        addSeparator,

        // Configuration
        setEnhanced,
        setMaxEntries,
        setAutoScroll,
        setShowTimestamps,
        setDebugMode,
        initializeEnhancedFlowInspector,

        // Aliases
        clear: clearInspectorLog,
        separator: addSeparator,
        log: logAPIFlow,

        // Utilities
        getConfig: () => ({ ...VFI_CONFIG }),

        // Test functions
        test: {
            basic: () => {
                const id = createFlowLog('Test Action', 'GET', '/api/test');
                setTimeout(() => updateFlowLog(id, {
                    controller_method: 'TestController.test',
                    service_method: 'TestService.process',
                    java21_methods_used: ['addLast'],
                    operation_description: 'Test completed successfully'
                }), 500);
            },
            enhanced: () => {
                logAPIFlow('Controller', 'TestController.enhanced');
                logAPIFlow('Service', 'TestService.processEnhanced');
                logAPIFlow('Feature', 'Java 21 Pattern Matching');
                addSeparator('Test Complete');
            },
            highlight: () => {
                highlightJavaMethod('addLast');
            }
        }
    };

    /* ================================
       GLOBAL EXPORTS
       ================================ */

    // Global function exports for backward compatibility
    window.createFlowLog = createFlowLog;
    window.updateFlowLog = updateFlowLog;
    window.clearInspectorLog = clearInspectorLog;
    window.highlightJavaMethod = highlightJavaMethod;
    window.logAPIFlow = logAPIFlow;
    window.handleEnhancedApiResponse = handleEnhancedApiResponse;
    window.initializeEnhancedFlowInspector = initializeEnhancedFlowInspector;

    // Aliases for different demos
    window.clearLog = clearInspectorLog; // Simple demos
    window.VFI = VFI; // Enhanced namespace access

    /* ================================
       INITIALIZATION
       ================================ */

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            safeLog('Visual Flow Inspector loaded and ready');
            console.log('✅ Visual Flow Inspector - All functions available');
            console.log('🎮 Try: VFI.test.basic() or VFI.test.enhanced()');
        });
    } else {
        safeLog('Visual Flow Inspector loaded and ready');
        console.log('✅ Visual Flow Inspector - All functions available');
        console.log('🎮 Try: VFI.test.basic() or VFI.test.enhanced()');
    }

})();