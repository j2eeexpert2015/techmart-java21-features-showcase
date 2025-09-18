/**
 * TechMart Shopping Cart Demo - JavaScript (RESTORED TO WORKING STATE)
 *
 * FIXED: All Visual Flow Inspector functions restored to ensure shopping cart works
 * This includes the original functions that were accidentally removed
 */

const DEMO_CONFIG = { customerId: 1, baseUrl: '' };

// --- API Action Functions ---
function fetchCartState() { apiCall('GET', `/api/cart/${DEMO_CONFIG.customerId}`, null, 'Initial Cart Load'); }
function addProductToCart(productId, productName, price) { apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/items`, { productId, productName, quantity: 1, price }, `Add ${productName}`); }
function addPriorityItem(productId, productName, price) { apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/priority-items`, { productId, productName, quantity: 1, price }, `Add ${productName} (Priority)`); }
function undoLastAction() { apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/undo`, null, 'Undo Last Action'); }
function clearCart() { apiCall('DELETE', `/api/cart/${DEMO_CONFIG.customerId}`, null, 'Clear Cart'); }
function removeCartItem(itemId, itemName) { apiCall('DELETE', `/api/cart/${DEMO_CONFIG.customerId}/items/${itemId}`, null, `Remove ${itemName}`);}
function redoLastAction() { showNotification('Redo functionality is not implemented in this demo.', 'info'); }

// --- Core API Caller ---
async function apiCall(method, endpoint, body = null, userAction) {
    const logId = createFlowLog(userAction, method, endpoint);
    try {
        const options = { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${DEMO_CONFIG.baseUrl}${endpoint}`, options);
        const result = await response.json();
        if (!response.ok) throw result;
        updateFlowLog(logId, result);
        await refreshCartDisplay(false);
    } catch (error) {
        const errorMessage = error.error || 'Request Failed';
        updateFlowLog(logId, { error: errorMessage });
        showNotification(errorMessage, 'danger');
    }
}

// --- VISUAL FLOW INSPECTOR FUNCTIONS (RESTORED) ---
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
 * RESTORED: Update flow log with backend response data
 * Handles the enhanced API responses with educational metadata
 * PRESERVED EXACTLY from original shopping-cart-demo.js
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

    // === HANDLE MULTIPLE SERVICE CALLS (like getCart) ===
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
    // === HANDLE SINGLE SERVICE CALL ===
    else if (responseData.service_method) {
        html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;

        if (responseData.java21_methods_used && responseData.java21_methods_used.length > 0) {
            html += `<div class="api-flow-child">🔥 Java 21 Method: <span class="java21-method-tag">${responseData.java21_methods_used.join(', ')}</span></div>`;
            responseData.java21_methods_used.forEach(method => highlightJavaMethod(method));
        }
    }

    // === ADD OPERATION DESCRIPTION ===
    if (responseData.operation_description) {
        html += `<div class="api-flow-child">💡 Operation: ${responseData.operation_description}</div>`;
    }

    // === ADD PERFORMANCE BENEFIT ===
    if (responseData.performance_benefit) {
        html += `<div class="api-flow-child">⚡ Performance: ${responseData.performance_benefit}</div>`;
    }

    // === ADD JAVA 21 FEATURE INFO ===
    if (responseData.java21_feature) {
        html += `<div class="api-flow-child">🎯 Feature: ${responseData.java21_feature}</div>`;
    }

    flowBlock.querySelector('[data-role="controller"]').innerHTML = html;
}

/**
 * RESTORED: Bullet-proof highlight for API reference table
 * PRESERVED EXACTLY from original shopping-cart-demo.js
 */
function highlightJavaMethod(methodName) {
    // Normalize method names like "addLast()" -> "addLast"
    const safe = String(methodName || '').replace(/\(\)$/, '');

    // 1) Clear any previous inline highlight we applied
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

    // 2) Find the target row
    const row = document.getElementById(`code-${safe}`);
    if (!row) return;

    // 3) Paint each cell using inline !important so nothing can override it
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

    // 4) Auto-remove after 2 seconds
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

function clearInspectorLog() {
    const logContainer = document.getElementById('api-log');
    if (!logContainer) return;
    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
}

// --- UI & Cart Management Functions ---
async function refreshCartDisplay(log = true) {
    try {
        const response = await fetch(`${DEMO_CONFIG.baseUrl}/api/cart/${DEMO_CONFIG.customerId}`);
        if (!response.ok) throw new Error('Backend not available');
        const cartData = await response.json();
        if (cartData) {
            updateCartUI(cartData);
            if (log) {
                const logId = createFlowLog('Initial Cart Load', 'GET', `/api/cart/${DEMO_CONFIG.customerId}`);
                updateFlowLog(logId, cartData);
            }
        }
    } catch(e) {
        showNotification('Could not connect to backend. Is the Java application running?', 'danger');
    }
}

function updateCartUI(cartData) {
    const container = document.getElementById('cart-items-display');
    const undoBtn = document.getElementById('undo-btn');
    container.innerHTML = '';

    if (!cartData.items || cartData.items.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-3">Cart is empty</div>';
        undoBtn.disabled = true;
        return;
    }

    undoBtn.disabled = false;
    cartData.items.forEach((item, index) => {
        const isFirst = index === 0 && cartData.items.length > 1;
        const isLast = index === cartData.items.length - 1 && cartData.items.length > 1;

        // === ENHANCED: Show which items are first/last from Java 21 methods ===
        let badges = '';
        if (cartData.oldestItem && item.id === cartData.oldestItem.id) {
            badges += '<span class="badge bg-success ms-2" title="Retrieved via getFirst()">First Added (getFirst)</span>';
        }
        if (cartData.newestItem && item.id === cartData.newestItem.id) {
            badges += '<span class="badge bg-primary ms-2" title="Retrieved via getLast()">Last Added (getLast)</span>';
        }

        // Fallback badges if oldestItem/newestItem not in response
        if (!badges) {
            if (isFirst) badges += '<span class="badge bg-success ms-2">First Added</span>';
            if (isLast) badges += '<span class="badge bg-primary ms-2">Last Added</span>';
        }

        const itemHtml = `
            <div class="cart-item-row">
              <div class="item-details">
                  <strong>${index + 1}. ${item.product.name}</strong> - $${item.unitPrice.toLocaleString()}
                  ${badges}
              </div>
              <button class="btn btn-sm btn-outline-danger remove-btn" onclick="removeCartItem(${item.id}, '${item.product.name}')">
                  Remove
              </button>
            </div>`;
        container.innerHTML += itemHtml;
    });

    // === SHOW CART METADATA FROM JAVA 21 METHODS ===
    if (cartData.oldestItem || cartData.newestItem) {
        let metadataHtml = '<div class="cart-metadata mt-3 p-2" style="background: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">';
        metadataHtml += '<strong>🔍 Java 21 Sequenced Collections Metadata:</strong><br>';

        if (cartData.oldestItem) {
            metadataHtml += `📅 <strong>Oldest Item</strong> (via getFirst()): ${cartData.oldestItem.name}<br>`;
        }
        if (cartData.newestItem) {
            metadataHtml += `🆕 <strong>Newest Item</strong> (via getLast()): ${cartData.newestItem.name}<br>`;
        }

        metadataHtml += '</div>';
        container.innerHTML += metadataHtml;
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `<span>${message}</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    container.appendChild(notification);
    setTimeout(() => { if (notification.parentNode) notification.remove() }, 4000);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', fetchCartState);