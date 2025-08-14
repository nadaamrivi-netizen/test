// Testing and Debugging Tools
class TestingSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.init();
    }

    init() {
        this.setupDebugMode();
        this.setupTestRunner();
        this.setupPerformanceTests();
        this.setupAccessibilityTests();
        this.setupCrossBrowserTests();
        this.setupResponsiveTests();
    }

    setupDebugMode() {
        // Debug mode toggle
        this.debugMode = localStorage.getItem('debug_mode') === 'true';
        
        if (this.debugMode) {
            this.showDebugPanel();
        }

        // Debug mode keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDebugMode();
            }
        });
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        localStorage.setItem('debug_mode', this.debugMode.toString());
        
        if (this.debugMode) {
            this.showDebugPanel();
        } else {
            this.hideDebugPanel();
        }
    }

    showDebugPanel() {
        const panel = document.createElement('div');
        panel.className = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h3>🔧 Debug Panel</h3>
                <button class="debug-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-section">
                    <h4>Performance</h4>
                    <div id="performance-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>Accessibility</h4>
                    <div id="accessibility-metrics"></div>
                </div>
                <div class="debug-section">
                    <h4>Console</h4>
                    <div id="debug-console"></div>
                </div>
                <div class="debug-section">
                    <h4>Tests</h4>
                    <button onclick="window.testingSuite.runAllTests()">Run All Tests</button>
                    <div id="test-results"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        this.updateDebugInfo();
    }

    hideDebugPanel() {
        const panel = document.querySelector('.debug-panel');
        if (panel) {
            panel.remove();
        }
    }

    updateDebugInfo() {
        if (!this.debugMode) return;

        // Update performance metrics
        const performanceDiv = document.getElementById('performance-metrics');
        if (performanceDiv) {
            const metrics = this.getPerformanceMetrics();
            performanceDiv.innerHTML = `
                <div>Page Load: ${metrics.pageLoad}ms</div>
                <div>DOM Ready: ${metrics.domReady}ms</div>
                <div>Memory: ${metrics.memory}MB</div>
                <div>FPS: ${metrics.fps}</div>
            `;
        }

        // Update accessibility metrics
        const accessibilityDiv = document.getElementById('accessibility-metrics');
        if (accessibilityDiv) {
            const a11yIssues = this.checkAccessibility();
            accessibilityDiv.innerHTML = `
                <div>Issues: ${a11yIssues.length}</div>
                <div>Score: ${this.calculateAccessibilityScore(a11yIssues)}%</div>
            `;
        }
    }

    setupTestRunner() {
        // Unit test framework
        this.test = (name, testFunction) => {
            this.tests.push({ name, testFunction });
        };

        // Assertion functions
        this.assertEqual = (actual, expected, message = '') => {
            if (actual !== expected) {
                throw new Error(`Assertion failed: ${actual} !== ${expected} ${message}`);
            }
        };

        this.assertTrue = (condition, message = '') => {
            if (!condition) {
                throw new Error(`Assertion failed: ${message}`);
            }
        };

        this.assertFalse = (condition, message = '') => {
            if (condition) {
                throw new Error(`Assertion failed: ${message}`);
            }
        };

        this.assertExists = (element, message = '') => {
            if (!element) {
                throw new Error(`Element not found: ${message}`);
            }
        };

        // Run all tests
        this.runAllTests = () => {
            this.results = [];
            let passed = 0;
            let failed = 0;

            this.tests.forEach(test => {
                try {
                    test.testFunction();
                    this.results.push({ name: test.name, status: 'PASS' });
                    passed++;
                } catch (error) {
                    this.results.push({ name: test.name, status: 'FAIL', error: error.message });
                    failed++;
                }
            });

            this.displayTestResults(passed, failed);
        };

        // Display test results
        this.displayTestResults = (passed, failed) => {
            const resultsDiv = document.getElementById('test-results');
            if (resultsDiv) {
                resultsDiv.innerHTML = `
                    <div class="test-summary">
                        <span class="test-passed">✓ ${passed} passed</span>
                        <span class="test-failed">✗ ${failed} failed</span>
                    </div>
                    <div class="test-details">
                        ${this.results.map(result => `
                            <div class="test-result ${result.status.toLowerCase()}">
                                <span class="test-name">${result.name}</span>
                                <span class="test-status">${result.status}</span>
                                ${result.error ? `<div class="test-error">${result.error}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        };
    }

    setupPerformanceTests() {
        // Performance monitoring
        this.getPerformanceMetrics = () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const memory = performance.memory;
            
            return {
                pageLoad: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                memory: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
                fps: this.calculateFPS()
            };
        };

        // FPS calculation
        this.calculateFPS = () => {
            let frameCount = 0;
            let lastTime = performance.now();
            
            const countFrames = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                    frameCount = 0;
                    lastTime = currentTime;
                    return fps;
                }
                
                requestAnimationFrame(countFrames);
            };
            
            return countFrames();
        };

        // Performance tests
        this.test('Page Load Performance', () => {
            const metrics = this.getPerformanceMetrics();
            this.assertTrue(metrics.pageLoad < 3000, 'Page load time should be under 3 seconds');
        });

        this.test('Memory Usage', () => {
            const metrics = this.getPerformanceMetrics();
            if (metrics.memory !== 'N/A') {
                this.assertTrue(metrics.memory < 100, 'Memory usage should be under 100MB');
            }
        });
    }

    setupAccessibilityTests() {
        // Accessibility checker
        this.checkAccessibility = () => {
            const issues = [];

            // Check for alt attributes on images
            document.querySelectorAll('img').forEach(img => {
                if (!img.alt && !img.getAttribute('aria-label')) {
                    issues.push({
                        type: 'missing-alt',
                        element: img,
                        message: 'Image missing alt attribute'
                    });
                }
            });

            // Check for proper heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                if (level > previousLevel + 1) {
                    issues.push({
                        type: 'heading-skip',
                        element: heading,
                        message: `Heading level skipped from h${previousLevel} to h${level}`
                    });
                }
                previousLevel = level;
            });

            // Check for proper form labels
            document.querySelectorAll('input, textarea, select').forEach(input => {
                if (!input.id || !document.querySelector(`label[for="${input.id}"]`)) {
                    issues.push({
                        type: 'missing-label',
                        element: input,
                        message: 'Form control missing associated label'
                    });
                }
            });

            // Check for color contrast (simplified)
            document.querySelectorAll('*').forEach(element => {
                const style = window.getComputedStyle(element);
                const color = style.color;
                const backgroundColor = style.backgroundColor;
                
                if (color && backgroundColor && color !== backgroundColor) {
                    // Basic contrast check (simplified)
                    const contrast = this.calculateContrast(color, backgroundColor);
                    if (contrast < 4.5) {
                        issues.push({
                            type: 'low-contrast',
                            element: element,
                            message: `Low color contrast: ${contrast.toFixed(2)}:1`
                        });
                    }
                }
            });

            return issues;
        };

        // Calculate color contrast ratio
        this.calculateContrast = (color1, color2) => {
            // Simplified contrast calculation
            // In a real implementation, you would convert colors to luminance
            return 4.5; // Placeholder
        };

        // Calculate accessibility score
        this.calculateAccessibilityScore = (issues) => {
            const totalChecks = 10; // Number of accessibility checks
            const issueCount = issues.length;
            return Math.max(0, Math.round((totalChecks - issueCount) / totalChecks * 100));
        };

        // Accessibility tests
        this.test('Images have alt attributes', () => {
            const issues = this.checkAccessibility().filter(issue => issue.type === 'missing-alt');
            this.assertEqual(issues.length, 0, 'All images should have alt attributes');
        });

        this.test('Form controls have labels', () => {
            const issues = this.checkAccessibility().filter(issue => issue.type === 'missing-label');
            this.assertEqual(issues.length, 0, 'All form controls should have labels');
        });
    }

    setupCrossBrowserTests() {
        // Browser compatibility tests
        this.test('Modern JavaScript Support', () => {
            this.assertTrue(typeof Promise !== 'undefined', 'Promise should be supported');
            this.assertTrue(typeof fetch !== 'undefined', 'Fetch API should be supported');
            this.assertTrue(typeof IntersectionObserver !== 'undefined', 'IntersectionObserver should be supported');
        });

        this.test('CSS Grid Support', () => {
            const testElement = document.createElement('div');
            testElement.style.display = 'grid';
            this.assertTrue(testElement.style.display === 'grid', 'CSS Grid should be supported');
        });

        this.test('Flexbox Support', () => {
            const testElement = document.createElement('div');
            testElement.style.display = 'flex';
            this.assertTrue(testElement.style.display === 'flex', 'Flexbox should be supported');
        });
    }

    setupResponsiveTests() {
        // Responsive design tests
        this.test('Mobile Viewport', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            this.assertExists(viewport, 'Viewport meta tag should exist');
        });

        this.test('Responsive Images', () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                this.assertTrue(img.style.maxWidth === '100%' || img.classList.contains('responsive'), 
                    'Images should be responsive');
            });
        });

        // Test different screen sizes
        this.testResponsiveBreakpoints = () => {
            const breakpoints = [
                { width: 320, height: 568, name: 'Mobile' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 1024, height: 768, name: 'Desktop' },
                { width: 1920, height: 1080, name: 'Large Desktop' }
            ];

            breakpoints.forEach(breakpoint => {
                this.test(`Responsive at ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, () => {
                    // Simulate viewport size
                    Object.defineProperty(window, 'innerWidth', {
                        writable: true,
                        configurable: true,
                        value: breakpoint.width
                    });
                    Object.defineProperty(window, 'innerHeight', {
                        writable: true,
                        configurable: true,
                        value: breakpoint.height
                    });

                    // Trigger resize event
                    window.dispatchEvent(new Event('resize'));

                    // Check if layout is appropriate
                    this.assertTrue(document.body.offsetWidth <= breakpoint.width, 
                        `Layout should fit within ${breakpoint.width}px width`);
                });
            });
        };
    }

    // Console logging for debugging
    setupConsoleLogging() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            originalLog.apply(console, args);
            this.logToDebugConsole('log', ...args);
        };

        console.error = (...args) => {
            originalError.apply(console, args);
            this.logToDebugConsole('error', ...args);
        };

        console.warn = (...args) => {
            originalWarn.apply(console, args);
            this.logToDebugConsole('warn', ...args);
        };
    }

    logToDebugConsole = (level, ...args) => {
        if (!this.debugMode) return;

        const consoleDiv = document.getElementById('debug-console');
        if (consoleDiv) {
            const logEntry = document.createElement('div');
            logEntry.className = `debug-log debug-${level}`;
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${level.toUpperCase()}: ${args.join(' ')}`;
            consoleDiv.appendChild(logEntry);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
    };

    // Export test results
    exportTestResults = () => {
        const data = {
            timestamp: new Date().toISOString(),
            results: this.results,
            performance: this.getPerformanceMetrics(),
            accessibility: this.checkAccessibility()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
}

// Initialize testing suite
document.addEventListener('DOMContentLoaded', () => {
    window.testingSuite = new TestingSuite();
});

// Add testing CSS
const testingCSS = `
    .debug-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        max-height: 80vh;
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        overflow: hidden;
        font-family: 'Courier New', monospace;
        font-size: 12px;
    }

    .debug-header {
        background: #667eea;
        color: white;
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .debug-header h3 {
        margin: 0;
        font-size: 14px;
    }

    .debug-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
    }

    .debug-content {
        padding: 15px;
        max-height: calc(80vh - 50px);
        overflow-y: auto;
    }

    .debug-section {
        margin-bottom: 20px;
    }

    .debug-section h4 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 13px;
        border-bottom: 1px solid #eee;
        padding-bottom: 5px;
    }

    .debug-section div {
        margin: 5px 0;
        font-size: 11px;
    }

    #debug-console {
        height: 150px;
        overflow-y: auto;
        background: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-size: 10px;
    }

    .debug-log {
        margin: 2px 0;
        padding: 2px 5px;
        border-radius: 3px;
    }

    .debug-log.debug-error {
        background: #ffebee;
        color: #c62828;
    }

    .debug-log.debug-warn {
        background: #fff3e0;
        color: #ef6c00;
    }

    .debug-log.debug-log {
        background: #e8f5e8;
        color: #2e7d32;
    }

    .test-summary {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;
    }

    .test-passed {
        color: #2e7d32;
        font-weight: bold;
    }

    .test-failed {
        color: #c62828;
        font-weight: bold;
    }

    .test-result {
        padding: 5px;
        margin: 2px 0;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .test-result.pass {
        background: #e8f5e8;
        color: #2e7d32;
    }

    .test-result.fail {
        background: #ffebee;
        color: #c62828;
    }

    .test-error {
        font-size: 10px;
        margin-top: 2px;
        font-style: italic;
    }

    /* Dark mode support */
    .dark-mode .debug-panel {
        background: #2d2d2d;
        color: white;
        border-color: #444;
    }

    .dark-mode .debug-section h4 {
        color: white;
        border-bottom-color: #444;
    }

    .dark-mode #debug-console {
        background: #1a1a1a;
        color: #ccc;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .debug-panel {
            width: calc(100vw - 40px);
            right: 20px;
            left: 20px;
        }
    }
`;

// Inject testing CSS
const style = document.createElement('style');
style.textContent = testingCSS;
document.head.appendChild(style); 