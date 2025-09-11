/**
 * TechMart Shopping Cart Demo - Final Polished JavaScript
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

// --- UI & Educational Functions ---
function createFlowLog(userAction, method, endpoint) {
    const logContainer = document.getElementById('api-log');
    if (logContainer.querySelector('.text-muted')) {
        logContainer.innerHTML = '';
    }
    const flowBlock = document.createElement('div');
    const logId = `flow-${Date.now()}`;
    flowBlock.id = logId;
    flowBlock.className = 'api-flow-block';
    flowBlock.innerHTML = `<div>👤 <strong>${userAction}</strong> (Frontend)</div>
                           <div class="api-flow-child">🌐 API Call: ${method} ${endpoint}</div>
                           <div class="api-flow-child" data-role="controller">🔴 Controller: Pending...</div>`;
    logContainer.prepend(flowBlock);
    return logId;
}

function updateFlowLog(logId, responseData) {
    const flowBlock = document.getElementById(logId);
    if (!flowBlock) return;

    if (responseData.error) {
        flowBlock.querySelector('[data-role="controller"]').innerHTML = `🔴 Controller: <span class="text-danger">${responseData.error}</span>`;
        return;
    }

    let html = `🔴 Controller: <strong>${responseData.controller_method}</strong>`;
    if (responseData.service_method) {
        html += `<div class="api-flow-child">🟣 Service: <strong>${responseData.service_method}</strong></div>`;
    }
    if (responseData.java21_method_used || responseData.java21_methods_used) {
        const methods = Array.isArray(responseData.java21_methods_used) ? responseData.java21_methods_used : [responseData.java21_method_used];
        html += `<div class="api-flow-child">🔥 Java 21 Method: <span class="java21-method-tag">${methods.join(', ')}</span></div>`;
        methods.forEach(highlightJavaMethod);
    }

    flowBlock.querySelector('[data-role="controller"]').innerHTML = html;
}

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

        const itemHtml = `
            <div class="cart-item-row">
              <div class="item-details">
                  <strong>${index + 1}. ${item.product.name}</strong> - $${item.unitPrice.toLocaleString()}
                  ${isFirst ? '<span class="badge bg-success ms-2">First Added</span>' : ''}
                  ${isLast ? '<span class="badge bg-primary ms-2">Last Added</span>' : ''}
              </div>
              <button class="btn btn-sm btn-outline-danger remove-btn" onclick="removeCartItem(${item.id}, '${item.product.name}')">
                  Remove
              </button>
            </div>`;
        container.innerHTML += itemHtml;
    });
}

/**
 * Highlight the API reference row for 2s.
 * Uses a CSS class that is Bootstrap-compatible (see CSS above).
 */
/**
 * Bullet-proof highlight: paint cells inline with !important, then clean up.
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
    logContainer.innerHTML = '<div class="text-muted text-center py-2">Log cleared. Click an action to see the call stack...</div>';
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