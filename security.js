// Security and Error Handling
class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSP();
        this.setupXSSProtection();
        this.setupCSRFProtection();
        this.setupErrorHandling();
        this.setupInputValidation();
        this.setupContentSecurity();
        this.setupRateLimiting();
    }

    setupCSP() {
        // Content Security Policy
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
            font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
            img-src 'self' data: https:;
            connect-src 'self' https:;
            frame-src 'none';
            object-src 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s+/g, ' ').trim();
        document.head.appendChild(cspMeta);
    }

    setupXSSProtection() {
        // XSS Protection headers
        const xssMeta = document.createElement('meta');
        xssMeta.httpEquiv = 'X-XSS-Protection';
        xssMeta.content = '1; mode=block';
        document.head.appendChild(xssMeta);

        // Sanitize user inputs
        this.sanitizeInput = (input) => {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        };

        // Sanitize HTML content
        this.sanitizeHTML = (html) => {
            const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br'];
            const allowedAttributes = ['href', 'target'];
            
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            const sanitizeNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent;
                }
                
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    if (!allowedTags.includes(tagName)) {
                        return node.textContent;
                    }
                    
                    const sanitizedNode = document.createElement(tagName);
                    
                    // Copy allowed attributes
                    for (let attr of node.attributes) {
                        if (allowedAttributes.includes(attr.name)) {
                            if (attr.name === 'href') {
                                // Validate URL
                                try {
                                    const url = new URL(attr.value);
                                    if (url.protocol === 'http:' || url.protocol === 'https:') {
                                        sanitizedNode.setAttribute(attr.name, attr.value);
                                    }
                                } catch (e) {
                                    // Invalid URL, skip
                                }
                            } else {
                                sanitizedNode.setAttribute(attr.name, attr.value);
                            }
                        }
                    }
                    
                    // Recursively sanitize child nodes
                    for (let child of node.childNodes) {
                        const sanitizedChild = sanitizeNode(child);
                        if (sanitizedChild) {
                            sanitizedNode.appendChild(sanitizedChild);
                        }
                    }
                    
                    return sanitizedNode;
                }
                
                return null;
            };
            
            return sanitizeNode(temp);
        };
    }

    setupCSRFProtection() {
        // Generate CSRF token
        this.generateCSRFToken = () => {
            const token = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
            sessionStorage.setItem('csrf_token', token);
            return token;
        };

        // Validate CSRF token
        this.validateCSRFToken = (token) => {
            const storedToken = sessionStorage.getItem('csrf_token');
            return token === storedToken;
        };

        // Add CSRF token to forms
        document.querySelectorAll('form').forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = this.generateCSRFToken();
            form.appendChild(tokenInput);
        });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                stack: event.reason?.stack
            });
        });

        // Network error handler
        window.addEventListener('offline', () => {
            this.showOfflineMessage();
        });

        window.addEventListener('online', () => {
            this.hideOfflineMessage();
        });
    }

    setupInputValidation() {
        // Email validation
        this.validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Phone validation
        this.validatePhone = (phone) => {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        };

        // URL validation
        this.validateURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        };

        // Form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showValidationError('Please check your input and try again.');
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            const value = input.value.trim();
            
            // Required field validation
            if (input.hasAttribute('required') && !value) {
                this.highlightError(input, 'This field is required');
                isValid = false;
                return;
            }

            // Email validation
            if (input.type === 'email' && value) {
                if (!this.validateEmail(value)) {
                    this.highlightError(input, 'Please enter a valid email address');
                    isValid = false;
                    return;
                }
            }

            // Phone validation
            if (input.type === 'tel' && value) {
                if (!this.validatePhone(value)) {
                    this.highlightError(input, 'Please enter a valid phone number');
                    isValid = false;
                    return;
                }
            }

            // URL validation
            if (input.type === 'url' && value) {
                if (!this.validateURL(value)) {
                    this.highlightError(input, 'Please enter a valid URL');
                    isValid = false;
                    return;
                }
            }

            // Length validation
            if (input.hasAttribute('minlength')) {
                const minLength = parseInt(input.getAttribute('minlength'));
                if (value.length < minLength) {
                    this.highlightError(input, `Minimum ${minLength} characters required`);
                    isValid = false;
                    return;
                }
            }

            if (input.hasAttribute('maxlength')) {
                const maxLength = parseInt(input.getAttribute('maxlength'));
                if (value.length > maxLength) {
                    this.highlightError(input, `Maximum ${maxLength} characters allowed`);
                    isValid = false;
                    return;
                }
            }

            // Clear error if valid
            this.clearError(input);
        });

        return isValid;
    }

    highlightError(input, message) {
        input.classList.add('error');
        input.style.borderColor = '#e74c3c';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 5px;
            display: block;
        `;
        input.parentNode.appendChild(errorDiv);
    }

    clearError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupContentSecurity() {
        // Prevent clickjacking
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }

        // Disable right-click context menu (optional)
        document.addEventListener('contextmenu', (e) => {
            // Uncomment the line below to disable right-click
            // e.preventDefault();
        });

        // Disable text selection (optional)
        document.addEventListener('selectstart', (e) => {
            // Uncomment the line below to disable text selection
            // e.preventDefault();
        });

        // Disable drag and drop (optional)
        document.addEventListener('dragstart', (e) => {
            // Uncomment the line below to disable drag and drop
            // e.preventDefault();
        });
    }

    setupRateLimiting() {
        // Simple rate limiting for form submissions
        this.rateLimiter = new Map();

        this.checkRateLimit = (key, limit = 5, windowMs = 60000) => {
            const now = Date.now();
            const userRequests = this.rateLimiter.get(key) || [];
            
            // Remove old requests
            const validRequests = userRequests.filter(time => now - time < windowMs);
            
            if (validRequests.length >= limit) {
                return false;
            }
            
            validRequests.push(now);
            this.rateLimiter.set(key, validRequests);
            return true;
        };

        // Apply rate limiting to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formId = form.id || 'default';
                if (!this.checkRateLimit(formId, 3, 60000)) { // 3 submissions per minute
                    e.preventDefault();
                    this.showRateLimitError();
                }
            });
        });
    }

    logError(type, details) {
        const errorLog = {
            type,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store error in localStorage
        const errors = JSON.parse(localStorage.getItem('error_log') || '[]');
        errors.push(errorLog);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('error_log', JSON.stringify(errors));

        // Send to analytics if available
        if (window.analytics) {
            window.analytics.trackEvent('Error', errorLog);
        }
    }

    showValidationError(message) {
        this.showNotification(message, 'error');
    }

    showRateLimitError() {
        this.showNotification('Too many requests. Please wait a moment before trying again.', 'warning');
    }

    showOfflineMessage() {
        this.showNotification('You are currently offline. Some features may not work.', 'warning');
    }

    hideOfflineMessage() {
        const notification = document.querySelector('.offline-notification');
        if (notification) {
            notification.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `security-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            text-align: center;
            animation: slideInDown 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Export error log
    exportErrorLog() {
        const errors = JSON.parse(localStorage.getItem('error_log') || '[]');
        const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clear error log
    clearErrorLog() {
        localStorage.removeItem('error_log');
    }
}

// Initialize security manager
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});

// Add security CSS
const securityCSS = `
    /* Error states */
    .error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }

    .error-message {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 5px;
        display: block;
    }

    /* Security notifications */
    .security-notification {
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    }

    /* Animation for notifications */
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }

    /* Security indicators */
    .security-indicator {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(52, 152, 219, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .security-indicator.secure {
        background: rgba(46, 204, 113, 0.9);
    }

    .security-indicator.warning {
        background: rgba(243, 156, 18, 0.9);
    }

    .security-indicator.danger {
        background: rgba(231, 76, 60, 0.9);
    }

    /* Dark mode support */
    .dark-mode .error {
        border-color: #e74c3c !important;
    }

    .dark-mode .error-message {
        color: #e74c3c;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .security-notification {
            left: 10px;
            right: 10px;
            transform: none;
            max-width: none;
        }
    }
`;

// Inject security CSS
const style = document.createElement('style');
style.textContent = securityCSS;
document.head.appendChild(style); 