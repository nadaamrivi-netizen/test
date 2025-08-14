// Accessibility Features
class Accessibility {
    constructor() {
        this.fontSize = 16;
        this.highContrast = false;
        this.reducedMotion = false;
        this.init();
    }

    init() {
        this.createAccessibilityPanel();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupColorContrast();
        this.setupFontSizeControls();
        this.setupReducedMotion();
        this.loadUserPreferences();
    }

    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <div class="accessibility-toggle">
                <button class="accessibility-btn" aria-label="Accessibility Settings">
                    <i class="fas fa-universal-access"></i>
                </button>
            </div>
            <div class="accessibility-menu">
                <h3>Accessibility Settings</h3>
                <div class="accessibility-option">
                    <label for="font-size">Font Size</label>
                    <div class="font-size-controls">
                        <button class="font-size-btn" data-action="decrease" aria-label="Decrease font size">A-</button>
                        <span class="font-size-display">${this.fontSize}px</span>
                        <button class="font-size-btn" data-action="increase" aria-label="Increase font size">A+</button>
                    </div>
                </div>
                <div class="accessibility-option">
                    <label for="high-contrast">
                        <input type="checkbox" id="high-contrast" class="accessibility-checkbox">
                        High Contrast
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="reduced-motion">
                        <input type="checkbox" id="reduced-motion" class="accessibility-checkbox">
                        Reduced Motion
                    </label>
                </div>
                <div class="accessibility-option">
                    <button class="skip-to-content-btn" onclick="this.skipToContent()">
                        Skip to Content
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        this.setupAccessibilityEvents();
    }

    setupAccessibilityEvents() {
        const toggleBtn = document.querySelector('.accessibility-btn');
        const menu = document.querySelector('.accessibility-menu');
        const highContrastCheckbox = document.getElementById('high-contrast');
        const reducedMotionCheckbox = document.getElementById('reduced-motion');

        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.accessibility-panel')) {
                menu.classList.remove('active');
            }
        });

        // Font size controls
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'increase') {
                    this.increaseFontSize();
                } else {
                    this.decreaseFontSize();
                }
            });
        });

        // High contrast toggle
        highContrastCheckbox.addEventListener('change', (e) => {
            this.toggleHighContrast(e.target.checked);
        });

        // Reduced motion toggle
        reducedMotionCheckbox.addEventListener('change', (e) => {
            this.toggleReducedMotion(e.target.checked);
        });
    }

    setupKeyboardNavigation() {
        // Skip to content functionality
        this.skipToContent = () => {
            const mainContent = document.querySelector('main') || document.querySelector('#home');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Plus to increase font size
            if ((e.ctrlKey || e.metaKey) && e.key === '=') {
                e.preventDefault();
                this.increaseFontSize();
            }
            // Ctrl/Cmd + Minus to decrease font size
            if ((e.ctrlKey || e.metaKey) && e.key === '-') {
                e.preventDefault();
                this.decreaseFontSize();
            }
            // Ctrl/Cmd + 0 to reset font size
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                this.resetFontSize();
            }
            // Escape to close accessibility menu
            if (e.key === 'Escape') {
                document.querySelector('.accessibility-menu').classList.remove('active');
            }
        });

        // Focus trap for accessibility menu
        const menu = document.querySelector('.accessibility-menu');
        const focusableElements = menu.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        menu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels and roles
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label')) {
                const text = button.textContent.trim();
                if (text) {
                    button.setAttribute('aria-label', text);
                }
            }
        });

        // Add skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #667eea;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const mainContent = document.querySelector('#home');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
    }

    setupFocusManagement() {
        // Focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #667eea !important;
                outline-offset: 2px !important;
            }
            
            .skip-link:focus {
                outline: 2px solid #ffd700 !important;
            }
        `;
        document.head.appendChild(style);

        // Focus trap for modals (if any)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modals = document.querySelectorAll('[role="dialog"]');
                modals.forEach(modal => {
                    if (modal.style.display !== 'none') {
                        const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                        const firstElement = focusableElements[0];
                        const lastElement = focusableElements[focusableElements.length - 1];

                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                });
            }
        });
    }

    setupColorContrast() {
        // Check color contrast ratios
        this.checkColorContrast = () => {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                const style = window.getComputedStyle(element);
                const backgroundColor = style.backgroundColor;
                const color = style.color;
                
                // Basic contrast check (simplified)
                if (backgroundColor && color) {
                    // Add contrast ratio calculation here if needed
                }
            });
        };
    }

    setupFontSizeControls() {
        this.increaseFontSize = () => {
            this.fontSize = Math.min(this.fontSize + 2, 24);
            this.updateFontSize();
        };

        this.decreaseFontSize = () => {
            this.fontSize = Math.max(this.fontSize - 2, 12);
            this.updateFontSize();
        };

        this.resetFontSize = () => {
            this.fontSize = 16;
            this.updateFontSize();
        };

        this.updateFontSize = () => {
            document.documentElement.style.fontSize = `${this.fontSize}px`;
            document.querySelector('.font-size-display').textContent = `${this.fontSize}px`;
            this.saveUserPreferences();
        };
    }

    setupReducedMotion() {
        this.toggleReducedMotion = (enabled) => {
            this.reducedMotion = enabled;
            if (enabled) {
                document.documentElement.style.setProperty('--animation-duration', '0.1s');
                document.documentElement.style.setProperty('--transition-duration', '0.1s');
            } else {
                document.documentElement.style.removeProperty('--animation-duration');
                document.documentElement.style.removeProperty('--transition-duration');
            }
            this.saveUserPreferences();
        };
    }

    toggleHighContrast = (enabled) => {
        this.highContrast = enabled;
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        this.saveUserPreferences();
    };

    saveUserPreferences() {
        const preferences = {
            fontSize: this.fontSize,
            highContrast: this.highContrast,
            reducedMotion: this.reducedMotion
        };
        localStorage.setItem('accessibility_preferences', JSON.stringify(preferences));
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('accessibility_preferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            this.fontSize = preferences.fontSize || 16;
            this.highContrast = preferences.highContrast || false;
            this.reducedMotion = preferences.reducedMotion || false;

            // Apply saved preferences
            this.updateFontSize();
            if (this.highContrast) {
                this.toggleHighContrast(true);
                document.getElementById('high-contrast').checked = true;
            }
            if (this.reducedMotion) {
                this.toggleReducedMotion(true);
                document.getElementById('reduced-motion').checked = true;
            }
        }
    }
}

// Initialize accessibility
document.addEventListener('DOMContentLoaded', () => {
    new Accessibility();
});

// Add accessibility CSS
const accessibilityCSS = `
    .accessibility-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
    }

    .accessibility-toggle {
        margin-bottom: 10px;
    }

    .accessibility-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
    }

    .accessibility-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .accessibility-menu {
        position: absolute;
        top: 60px;
        right: 0;
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        min-width: 250px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }

    .accessibility-menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .accessibility-menu h3 {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 1.1rem;
    }

    .accessibility-option {
        margin-bottom: 15px;
    }

    .accessibility-option label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        color: #333;
    }

    .accessibility-checkbox {
        width: 18px;
        height: 18px;
        accent-color: #667eea;
    }

    .font-size-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .font-size-btn {
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease;
    }

    .font-size-btn:hover {
        background: #5a6fd8;
    }

    .font-size-display {
        min-width: 50px;
        text-align: center;
        font-weight: bold;
        color: #667eea;
    }

    .skip-to-content-btn {
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s ease;
    }

    .skip-to-content-btn:hover {
        background: #5a6fd8;
    }

    /* High contrast mode */
    .high-contrast {
        filter: contrast(1.5) brightness(1.2);
    }

    .high-contrast * {
        border-color: #000 !important;
    }

    .high-contrast .btn {
        border: 2px solid #000 !important;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }

    /* Dark mode support */
    .dark-mode .accessibility-menu {
        background: #2d2d2d;
        color: white;
    }

    .dark-mode .accessibility-menu h3 {
        color: white;
    }

    .dark-mode .accessibility-option label {
        color: white;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .accessibility-panel {
            top: 10px;
            right: 10px;
        }

        .accessibility-menu {
            min-width: 200px;
            padding: 15px;
        }
    }
`;

// Inject accessibility CSS
const style = document.createElement('style');
style.textContent = accessibilityCSS;
document.head.appendChild(style); 