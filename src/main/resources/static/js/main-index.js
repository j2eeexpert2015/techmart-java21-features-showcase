/**
 * TechMart Main Index Page - JavaScript
 *
 * Handles interactions and enhancements for the main demo platform landing page.
 * Provides smooth user experience, analytics tracking, and accessibility features.
 *
 * Author: Java 21 Course
 * Purpose: Main navigation hub interactions and user experience enhancements
 * Features: Click tracking, loading states, smooth scrolling, error handling
 */

/* ================================
   APPLICATION STATE AND CONFIGURATION
   ================================ */

/**
 * Configuration object for the demo platform
 */
const DemoPlatformConfig = {
    // Analytics and tracking
    trackingEnabled: true,
    loadingDelay: 150, // ms delay for loading states

    // Animation settings
    scrollBehavior: 'smooth',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Demo information
    demos: {
        'shopping-cart': {
            name: 'Shopping Cart Demo',
            features: ['Sequenced Collections', 'getFirst/getLast', 'addFirst/addLast'],
            url: 'shopping-cart-demo.html'
        },
        'payment-processing': {
            name: 'Payment Processing Demo',
            features: ['Record Patterns', 'Pattern Matching', 'Guard Conditions'],
            url: 'payment-processing-demo.html'
        },
        'string-templates': {
            name: 'String Templates Demo',
            features: ['STR Processor', 'Safe Interpolation', 'SQL Prevention'],
            url: 'string-templates-demo.html'
        }
    }
};

/**
 * Application state tracking
 */
const AppState = {
    initialized: false,
    demoClicks: 0,
    lastClickedDemo: null,
    startTime: Date.now()
};

/* ================================
   CORE INITIALIZATION
   ================================ */

/**
 * Initializes the demo platform when DOM is ready
 * Sets up event listeners, tracking, and initial state
 */
function initializeDemoPlatform() {
    console.log('🚀 TechMart Demo Platform Initializing...');

    // Setup demo card interactions
    setupDemoCardInteractions();

    // Setup smooth scrolling for internal links
    setupSmoothScrolling();

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Setup loading states
    setupLoadingStates();

    // Setup error handling
    setupErrorHandling();

    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Mark as initialized
    AppState.initialized = true;

    // Show welcome message
    showWelcomeMessage();

    console.log('✅ Demo Platform Initialized Successfully');
}

/* ================================
   DEMO CARD INTERACTION HANDLERS
   ================================ */

/**
 * Sets up interactive behavior for demo cards
 * Handles clicks, hover effects, and navigation
 */
function setupDemoCardInteractions() {
    const demoCards = document.querySelectorAll('.demo-card');

    demoCards.forEach(card => {
        const demoType = card.getAttribute('data-demo');
        const demoInfo = DemoPlatformConfig.demos[demoType];

        if (!demoInfo) {
            console.warn(`Demo configuration not found for: ${demoType}`);
            return;
        }

        // Add click tracking and navigation
        card.addEventListener('click', function(e) {
            handleDemoCardClick(e, demoType, demoInfo);
        });

        // Add hover analytics
        card.addEventListener('mouseenter', function() {
            trackDemoHover(demoType, demoInfo.name);
        });

        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            handleDemoCardKeydown(e, demoType, demoInfo);
        });

        // Store original icon class for loading states
        const icon = card.querySelector('.demo-icon i');
        if (icon) {
            icon.setAttribute('data-original-class', icon.className);
        }
    });

    console.log(`📋 Setup interactions for ${demoCards.length} demo cards`);
}

/**
 * Handles demo card click events
 * @param {Event} event - Click event
 * @param {string} demoType - Type of demo clicked
 * @param {Object} demoInfo - Demo configuration object
 */
function handleDemoCardClick(event, demoType, demoInfo) {
    event.preventDefault();

    // Track the click
    trackDemoClick(demoType, demoInfo.name);

    // Update app state
    AppState.demoClicks++;
    AppState.lastClickedDemo = demoType;

    // Add visual feedback
    addClickFeedback(event.currentTarget);

    // Show loading state
    showDemoLoadingState(event.currentTarget, demoType);

}

/**
 * Handles keyboard navigation for demo cards
 * @param {KeyboardEvent} event - Keyboard event
 * @param {string} demoType - Type of demo
 * @param {Object} demoInfo - Demo configuration object
 */
function handleDemoCardKeydown(event, demoType, demoInfo) {
    // Handle Enter and Space key presses
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
    }

    // Handle arrow key navigation between cards
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        navigateBetweenCards(event);
    }
}

/**
 * Navigates between demo cards using keyboard
 * @param {KeyboardEvent} event - Keyboard event
 */
function navigateBetweenCards(event) {
    const cards = Array.from(document.querySelectorAll('.demo-card'));
    const currentIndex = cards.indexOf(event.currentTarget);

    let nextIndex;
    if (event.key === 'ArrowRight') {
        nextIndex = currentIndex + 1 >= cards.length ? 0 : currentIndex + 1;
    } else {
        nextIndex = currentIndex - 1 < 0 ? cards.length - 1 : currentIndex - 1;
    }

    cards[nextIndex].focus();
    event.preventDefault();
}

/* ================================
   VISUAL FEEDBACK AND LOADING STATES
   ================================ */

/**
 * Adds visual click feedback to demo cards
 * @param {HTMLElement} card - Demo card element
 */
function addClickFeedback(card) {
    // Add subtle scale effect
    card.style.transform = 'scale(0.98)';

    // Reset after brief delay
    setTimeout(() => {
        card.style.transform = '';
    }, 100);
}

/**
 * Shows loading state for demo navigation
 * @param {HTMLElement} card - Demo card element
 * @param {string} demoType - Type of demo being loaded
 */
function showDemoLoadingState(card, demoType) {
    const icon = card.querySelector('.demo-icon i');
    const title = card.querySelector('.demo-title');

    if (icon) {
        // Change icon to loading spinner
        icon.className = 'fas fa-spinner fa-spin';
    }

    if (title) {
        // Add loading text
        const originalText = title.textContent;
        title.setAttribute('data-original-text', originalText);
        title.textContent = 'Loading Demo...';

        // Reset after navigation
        setTimeout(() => {
            const storedOriginal = title.getAttribute('data-original-text');
            if (storedOriginal) {
                title.textContent = storedOriginal;
            }

            if (icon) {
                const originalClass = icon.getAttribute('data-original-class');
                if (originalClass) {
                    icon.className = originalClass;
                }
            }
        }, 2000);
    }
}

/* ================================
   NAVIGATION AND ROUTING
   ================================ */

/**
 * Navigates to a demo page
 * @param {string} url - Demo page URL
 * @param {string} demoName - Name of the demo for tracking
 */
function navigateToDemo(url, demoName) {
    try {
        // Log navigation attempt
        console.log(`🎯 Navigating to demo: ${demoName} (${url})`);

        // Check if URL exists (basic validation)
        if (!url || url.trim() === '') {
            throw new Error('Invalid demo URL');
        }

        // Navigate to demo page
        window.location.href = url;

    } catch (error) {
        console.error('Navigation error:', error);
        showErrorNotification(`Failed to load ${demoName}. Please try again.`);

        // Reset loading states on error
        resetAllLoadingStates();
    }
}

/**
 * Resets all loading states in case of navigation error
 */
function resetAllLoadingStates() {
    const cards = document.querySelectorAll('.demo-card');

    cards.forEach(card => {
        const icon = card.querySelector('.demo-icon i');
        const title = card.querySelector('.demo-title');

        if (icon) {
            const originalClass = icon.getAttribute('data-original-class');
            if (originalClass) {
                icon.className = originalClass;
            }
        }

        if (title) {
            const originalText = title.getAttribute('data-original-text');
            if (originalText) {
                title.textContent = originalText;
            }
        }
    });
}

/* ================================
   SMOOTH SCROLLING SETUP
   ================================ */

/**
 * Sets up smooth scrolling for internal page links
 */
function setupSmoothScrolling() {
    // Only setup if reduced motion is not preferred
    if (DemoPlatformConfig.reducedMotion) {
        console.log('📱 Reduced motion preferred - skipping smooth scroll setup');
        return;
    }

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: DemoPlatformConfig.scrollBehavior,
                    block: 'start'
                });

                console.log(`🔗 Smooth scrolled to: #${targetId}`);
            }
        });
    });

    console.log(`🔗 Setup smooth scrolling for ${internalLinks.length} internal links`);
}

/* ================================
   KEYBOARD NAVIGATION SETUP
   ================================ */

/**
 * Sets up global keyboard navigation and shortcuts
 */
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Handle global keyboard shortcuts
        switch(e.key) {
            case 'Escape':
                // Clear all notifications
                clearAllNotifications();
                console.log('⌨️ Cleared notifications via Escape key');
                break;

            case 'F1':
                // Show help/info
                e.preventDefault();
                showPlatformInfo();
                console.log('⌨️ Showed platform info via F1');
                break;

            case '1':
            case '2':
            case '3':
                // Quick navigation to demos (Alt + number)
                if (e.altKey) {
                    e.preventDefault();
                    const demoIndex = parseInt(e.key) - 1;
                    quickNavigateToDemo(demoIndex);
                }
                break;
        }
    });

    console.log('⌨️ Global keyboard navigation setup complete');
}

/**
 * Quick navigation to demo by index
 * @param {number} index - Demo index (0-2)
 */
function quickNavigateToDemo(index) {
    const demoCards = document.querySelectorAll('.demo-card');

    if (index >= 0 && index < demoCards.length) {
        demoCards[index].click();
        console.log(`⌨️ Quick navigated to demo ${index + 1}`);
    }
}

/* ================================
   LOADING STATES AND ERROR HANDLING
   ================================ */

/**
 * Sets up loading state management
 */
function setupLoadingStates() {
    // Add loading class to body during initialization
    document.body.classList.add('demo-platform-loading');

    // Remove loading class when everything is ready
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('demo-platform-loading');
            console.log('📦 Platform loading complete');
        }, 100);
    });
}

/**
 * Sets up global error handling
 */
function setupErrorHandling() {
    // Handle JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('Platform error:', e.error);
        showErrorNotification('Something went wrong. Please refresh the page.');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showErrorNotification('An unexpected error occurred.');
    });

    console.log('🛡️ Error handling setup complete');
}

/* ================================
   ANALYTICS AND TRACKING
   ================================ */

/**
 * Tracks demo card clicks for analytics
 * @param {string} demoType - Type of demo clicked
 * @param {string} demoName - Name of the demo
 */
function trackDemoClick(demoType, demoName) {
    if (!DemoPlatformConfig.trackingEnabled) return;

    const trackingData = {
        event: 'demo_click',
        demo_type: demoType,
        demo_name: demoName,
        timestamp: Date.now(),
        session_time: Date.now() - AppState.startTime,
        click_count: AppState.demoClicks + 1
    };

    console.log('📊 Demo Click Tracked:', trackingData);

    // Here you would send to your analytics service
    // Example: analytics.track('demo_click', trackingData);
}

/**
 * Tracks demo card hover events
 * @param {string} demoType - Type of demo hovered
 * @param {string} demoName - Name of the demo
 */
function trackDemoHover(demoType, demoName) {
    if (!DemoPlatformConfig.trackingEnabled) return;

    console.log(`👀 Demo Hover: ${demoName} (${demoType})`);

    // Throttled tracking to avoid spam
    if (!trackDemoHover.lastHover || Date.now() - trackDemoHover.lastHover > 1000) {
        trackDemoHover.lastHover = Date.now();
        // Send hover analytics here
    }
}

/* ================================
   PERFORMANCE MONITORING
   ================================ */

/**
 * Sets up performance monitoring and reporting
 */
function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = Math.round(performance.now());
            console.log(`⚡ Page loaded in ${loadTime}ms`);

            // Detailed performance metrics
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    const metrics = {
                        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                        totalLoad: loadTime
                    };

                    console.log('📈 Performance Metrics:', metrics);

                    // Track slow loads
                    if (loadTime > 3000) {
                        console.warn('⚠️ Slow page load detected');
                    }
                }
            }, 1000);
        }
    });
}

/* ================================
   NOTIFICATION SYSTEM
   ================================ */

/**
 * Shows a welcome message to users
 */
function showWelcomeMessage() {
    setTimeout(() => {
        showSuccessNotification('Welcome to TechMart! Explore Java 21 features through interactive demos.');
    }, 1500);
}

/**
 * Shows platform information
 */
function showPlatformInfo() {
    const info = `
🚀 TechMart Java 21 Demo Platform

📊 Session Stats:
• Demo clicks: ${AppState.demoClicks}
• Last demo: ${AppState.lastClickedDemo || 'None'}
• Session time: ${Math.round((Date.now() - AppState.startTime) / 1000)}s

⌨️ Keyboard Shortcuts:
• Alt+1/2/3: Quick demo navigation
• F1: Show this info
• Escape: Clear notifications

🎯 Available Demos: ${Object.keys(DemoPlatformConfig.demos).length}
    `;

    console.log(info);
    showInfoNotification('Platform info logged to console (F12)');
}

/**
 * Shows a success notification
 * @param {string} message - Success message to display
 */
function showSuccessNotification(message) {
    showNotification(message, 'success');
}

/**
 * Shows an error notification
 * @param {string} message - Error message to display
 */
function showErrorNotification(message) {
    showNotification(message, 'danger');
}

/**
 * Shows an info notification
 * @param {string} message - Info message to display
 */
function showInfoNotification(message) {
    showNotification(message, 'info');
}

/**
 * Generic notification function
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, danger, info, warning)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show custom-toast`;
    notification.setAttribute('role', 'alert');

    // Icon mapping
    const icons = {
        'success': 'fas fa-check-circle',
        'danger': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle',
        'warning': 'fas fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span class="ms-2">${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Add to container
    const container = document.getElementById('toast-container') || document.body;
    container.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);

    console.log(`📢 Notification (${type}): ${message}`);
}

/**
 * Clears all active notifications
 */
function clearAllNotifications() {
    const notifications = document.querySelectorAll('.alert');
    notifications.forEach(notification => {
        notification.remove();
    });
}

/* ================================
   WINDOW EVENT HANDLERS
   ================================ */

/**
 * Handles window focus events
 */
window.addEventListener('focus', function() {
    console.log('👁️ Window focused - platform active');

    // Refresh any time-sensitive data if needed
    if (AppState.initialized) {
        // Placeholder for refresh logic
    }
});

/**
 * Handles window blur events
 */
window.addEventListener('blur', function() {
    console.log('😴 Window blurred - platform inactive');
});

/**
 * Handles page visibility change
 */
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('👀 Page visible - ensuring platform state');
    } else {
        console.log('🙈 Page hidden - pausing non-essential operations');
    }
});

/* ================================
   INITIALIZATION
   ================================ */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDemoPlatform);

// Backup initialization for immediate script execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDemoPlatform);
} else {
    // DOM already loaded
    initializeDemoPlatform();
}

/* ================================
   EXPORT FOR TESTING/DEBUGGING
   ================================ */

// Make key functions available globally for testing
window.TechMartPlatform = {
    config: DemoPlatformConfig,
    state: AppState,
    navigateToDemo,
    showNotification,
    clearAllNotifications,
    trackDemoClick,
    showPlatformInfo
};