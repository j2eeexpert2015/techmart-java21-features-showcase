/**
 * TechMart Shopping Cart Demo - JavaScript (CLEANED)
 *
 * CLEANED UP: Removed all "EMERGENCY FIX" Visual Flow Inspector functions
 * NOW USES: Shared visual-flow-inspector.js component properly
 *
 * This demonstrates Java 21 Sequenced Collections through shopping cart operations
 */

/* ================================
   DEMO CONFIGURATION
   ================================ */

const DEMO_CONFIG = {
    customerId: 1,
    baseUrl: ''
};

/* ================================
   API ACTION FUNCTIONS - SHOPPING CART OPERATIONS
   ================================ */

/**
 * Load initial cart state
 */
function fetchCartState() {
    apiCall('GET', `/api/cart/${DEMO_CONFIG.customerId}`, null, 'Initial Cart Load');
}

/**
 * Add regular product to cart (uses addLast)
 */
function addProductToCart(productId, productName, price) {
    const payload = { productId, productName, quantity: 1, price };
    apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/items`, payload, `Add ${productName}`);
}

/**
 * Add priority item to cart (uses addFirst for VIP)
 */
function addPriorityItem(productId, productName, price) {
    const payload = { productId, productName, quantity: 1, price };
    apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/priority-items`, payload, `Add ${productName} (Priority)`);
}

/**
 * Undo last action (uses removeLast)
 */
function undoLastAction() {
    apiCall('POST', `/api/cart/${DEMO_CONFIG.customerId}/undo`, null, 'Undo Last Action');
}

/**
 * Clear entire cart
 */
function clearCart() {
    apiCall('DELETE', `/api/cart/${DEMO_CONFIG.customerId}`, null, 'Clear Cart');
}

/**
 * Remove specific item from cart
 */
function removeCartItem(itemId, itemName) {
    apiCall('DELETE', `/api/cart/${DEMO_CONFIG.customerId}/items/${itemId}`, null, `Remove ${itemName}`);
}

/**
 * Redo functionality (not implemented in backend yet)
 */
function redoLastAction() {
    showNotification('Redo functionality is not implemented in this demo.', 'info');
}

/* ================================
   CORE API COMMUNICATION
   ================================ */

/**
 * Universal API caller with Visual Flow Inspector integration
 */
async function apiCall(method, endpoint, body = null, userAction) {
    console.log(`🔄 API Call: ${method} ${endpoint} for ${userAction}`);

    // Use the shared Visual Flow Inspector to create log entry
    const logId = createFlowLog(userAction, method, endpoint);

    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${DEMO_CONFIG.baseUrl}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`✅ API Response for ${userAction}:`, result);

        // Use the shared Visual Flow Inspector to update log entry
        updateFlowLog(logId, result);

        // Refresh cart display after successful API call
        await refreshCartDisplay(false);

        return result;

    } catch (error) {
        console.error(`❌ API Error for ${userAction}:`, error);

        const errorMessage = error.message || 'Request Failed';

        // Use shared Visual Flow Inspector for error logging
        updateFlowLog(logId, {
            error: errorMessage,
            controller_method: 'Error - Backend Unavailable'
        });

        showNotification(errorMessage, 'danger');
        throw error;
    }
}

/* ================================
   CART UI MANAGEMENT
   ================================ */

/**
 * Refresh cart display by fetching current state
 */
async function refreshCartDisplay(log = true) {
    try {
        const response = await fetch(`${DEMO_CONFIG.baseUrl}/api/cart/${DEMO_CONFIG.customerId}`);

        if (!response.ok) {
            throw new Error('Backend not available');
        }

        const cartData = await response.json();
        console.log('📋 Cart data received:', cartData);

        if (cartData) {
            updateCartUI(cartData);

            // Log initial cart load if requested
            if (log) {
                const logId = createFlowLog('Initial Cart Load', 'GET', `/api/cart/${DEMO_CONFIG.customerId}`);
                updateFlowLog(logId, cartData);
            }
        }

    } catch (error) {
        console.error('❌ Failed to refresh cart:', error);
        showNotification('Could not connect to backend. Is the Java application running on localhost:8080?', 'danger');
    }
}

/**
 * Update the cart UI with current cart data
 */
function updateCartUI(cartData) {
    const container = document.getElementById('cart-items-display');
    const undoBtn = document.getElementById('undo-btn');

    if (!container) {
        console.error('Cart items display container not found');
        return;
    }

    container.innerHTML = '';

    // Handle empty cart
    if (!cartData.items || cartData.items.length === 0) {
        container.innerHTML = '<div class="text-muted text-center py-3">Cart is empty</div>';
        if (undoBtn) undoBtn.disabled = true;
        return;
    }

    // Enable undo button when cart has items
    if (undoBtn) undoBtn.disabled = false;

    // Render each cart item
    cartData.items.forEach((item, index) => {
        const isFirst = index === 0 && cartData.items.length > 1;
        const isLast = index === cartData.items.length - 1 && cartData.items.length > 1;

        // Create badges to show Java 21 Sequenced Collections insights
        let badges = '';

        // Use actual metadata from backend if available
        if (cartData.oldestItem && item.id === cartData.oldestItem.id) {
            badges += '<span class="badge bg-success ms-2" title="Retrieved via getFirst()">First Added (getFirst)</span>';
        }
        if (cartData.newestItem && item.id === cartData.newestItem.id) {
            badges += '<span class="badge bg-primary ms-2" title="Retrieved via getLast()">Last Added (getLast)</span>';
        }

        // Fallback badges based on position if metadata not available
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
                <button class="btn btn-sm btn-outline-danger remove-btn"
                        onclick="removeCartItem(${item.id}, '${item.product.name.replace(/'/g, "\\'")}')">
                    Remove
                </button>
            </div>`;

        container.innerHTML += itemHtml;
    });

    // Add Java 21 Sequenced Collections metadata section
    if (cartData.oldestItem || cartData.newestItem) {
        let metadataHtml = `
            <div class="cart-metadata mt-3 p-2" style="background: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                <strong>🔍 Java 21 Sequenced Collections Metadata:</strong><br>`;

        if (cartData.oldestItem) {
            metadataHtml += `📅 <strong>Oldest Item</strong> (via getFirst()): ${cartData.oldestItem.name}<br>`;
        }
        if (cartData.newestItem) {
            metadataHtml += `🆕 <strong>Newest Item</strong> (via getLast()): ${cartData.newestItem.name}<br>`;
        }

        metadataHtml += '</div>';
        container.innerHTML += metadataHtml;
    }

    console.log(`📋 Cart UI updated: ${cartData.items.length} items displayed`);
}

/* ================================
   NOTIFICATION SYSTEM
   ================================ */

/**
 * Show toast notification to user
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
        // Fallback to console if no toast container
        console.log(`${type.toUpperCase()}: ${message}`);
        return;
    }

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

/* ================================
   DEMO INITIALIZATION
   ================================ */

/**
 * Initialize the shopping cart demo
 */
function initializeShoppingCartDemo() {
    console.log('🚀 Shopping Cart Demo Initializing...');

    // Fetch initial cart state
    fetchCartState();

    console.log('✅ Shopping Cart Demo Ready');
    console.log('🎮 Available actions: addProductToCart, addPriorityItem, undoLastAction, clearCart');
    console.log('🔧 Backend URL:', DEMO_CONFIG.baseUrl || 'http://localhost:8080');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeShoppingCartDemo();
});

/* ================================
   DEVELOPER DEBUGGING UTILITIES
   ================================ */

/**
 * Debug utilities for console testing
 */
window.CartDemo = {
    // API actions
    addProduct: addProductToCart,
    addPriority: addPriorityItem,
    undo: undoLastAction,
    clear: clearCart,
    refresh: () => refreshCartDisplay(true),

    // Direct API access
    directAPI: apiCall,

    // Visual Flow Inspector access
    clearLog: clearInspectorLog,

    // State inspection
    getConfig: () => DEMO_CONFIG,

    // Test functions
    testSequence: async () => {
        console.log('🧪 Running test sequence...');
        try {
            await addProductToCart(1, 'Test iPhone', 999);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await addProductToCart(2, 'Test AirPods', 249);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await addPriorityItem(3, 'Test MacBook', 1999);
            console.log('✅ Test sequence completed');
        } catch (error) {
            console.error('❌ Test sequence failed:', error);
        }
    }
};

console.log('🚀 Shopping Cart Demo loaded successfully');
console.log('🎮 Try: CartDemo.testSequence() or CartDemo.addProduct(1, "iPhone", 999)');