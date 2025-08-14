// Analytics and Performance Monitoring
class Analytics {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            totalBlockingTime: 0
        };
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureWebVitals();
        this.trackUserInteractions();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.setupErrorTracking();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.pageLoadTime = loadTime;
            this.logMetric('Page Load Time', loadTime);
        });
    }

    measureWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                    this.logMetric('First Contentful Paint', entry.startTime);
                }
            });
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            this.logMetric('Largest Contentful Paint', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
            let cls = 0;
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift = cls;
            this.logMetric('Cumulative Layout Shift', cls);
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                this.logMetric('First Input Delay', this.metrics.firstInputDelay);
                break;
            }
        }).observe({ entryTypes: ['first-input'] });

        // Total Blocking Time
        new PerformanceObserver((list) => {
            let totalBlockingTime = 0;
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    totalBlockingTime += entry.duration - 50;
                }
            }
            this.metrics.totalBlockingTime = totalBlockingTime;
            this.logMetric('Total Blocking Time', totalBlockingTime);
        }).observe({ entryTypes: ['longtask'] });
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
                this.trackEvent('Button Click', {
                    buttonText: button.textContent.trim(),
                    buttonClass: button.className,
                    pageSection: this.getPageSection(button)
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('Form Submission', {
                formId: e.target.id || 'unknown',
                formAction: e.target.action || 'unknown'
            });
        });

        // Track navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href.includes('#')) {
                this.trackEvent('Navigation Click', {
                    target: e.target.getAttribute('href'),
                    linkText: e.target.textContent.trim()
                });
            }
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        let scrollSections = {
            '0-25': false,
            '25-50': false,
            '50-75': false,
            '75-100': false
        };

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            // Track max scroll depth
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
            }

            // Track scroll sections
            Object.keys(scrollSections).forEach(section => {
                const [min, max] = section.split('-').map(Number);
                if (scrollPercent >= min && scrollPercent < max && !scrollSections[section]) {
                    scrollSections[section] = true;
                    this.trackEvent('Scroll Section Reached', {
                        section: section,
                        scrollPercent: scrollPercent
                    });
                }
            });
        });

        // Track final scroll depth on page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('Page Exit', {
                maxScrollDepth: Math.round(maxScrollDepth),
                timeOnPage: this.getTimeOnPage()
            });
        });
    }

    trackTimeOnPage() {
        this.pageStartTime = Date.now();
        
        // Track time on page every 30 seconds
        setInterval(() => {
            const timeOnPage = this.getTimeOnPage();
            if (timeOnPage % 30 === 0) {
                this.trackEvent('Time on Page', {
                    seconds: timeOnPage
                });
            }
        }, 1000);
    }

    getTimeOnPage() {
        return Math.floor((Date.now() - this.pageStartTime) / 1000);
    }

    getPageSection(element) {
        const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
        for (const section of sections) {
            if (element.closest(`#${section}`)) {
                return section;
            }
        }
        return 'unknown';
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackEvent('JavaScript Error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('Unhandled Promise Rejection', {
                reason: e.reason
            });
        });
    }

    logMetric(name, value) {
        console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
        
        // Send to analytics service (replace with your preferred service)
        this.sendToAnalytics(name, value);
    }

    trackEvent(eventName, parameters = {}) {
        console.log(`📈 Event: ${eventName}`, parameters);
        
        // Send to analytics service (replace with your preferred service)
        this.sendToAnalytics('event', {
            eventName,
            parameters,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    sendToAnalytics(type, data) {
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            if (type === 'event') {
                gtag('event', data.eventName, data.parameters);
            } else {
                gtag('event', 'web_vitals', {
                    metric_name: type,
                    metric_value: data,
                    metric_id: this.generateMetricId()
                });
            }
        }

        // Example: Send to custom analytics endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ type, data })
        // });

        // Store in localStorage for offline tracking
        this.storeOfflineData(type, data);
    }

    generateMetricId() {
        return 'metric_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    storeOfflineData(type, data) {
        const offlineData = JSON.parse(localStorage.getItem('analytics_offline') || '[]');
        offlineData.push({
            type,
            data,
            timestamp: Date.now()
        });
        
        // Keep only last 100 entries
        if (offlineData.length > 100) {
            offlineData.splice(0, offlineData.length - 100);
        }
        
        localStorage.setItem('analytics_offline', JSON.stringify(offlineData));
    }

    // Get performance summary
    getPerformanceSummary() {
        return {
            ...this.metrics,
            timeOnPage: this.getTimeOnPage(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };
    }

    // Export analytics data
    exportAnalyticsData() {
        const data = {
            performance: this.getPerformanceSummary(),
            offlineData: JSON.parse(localStorage.getItem('analytics_offline') || '[]'),
            timestamp: Date.now()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new Analytics();
});

// Add analytics CSS for debugging
const analyticsCSS = `
    .analytics-debug {
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 300px;
    }

    .analytics-debug h4 {
        margin: 0 0 10px 0;
        color: #667eea;
    }

    .analytics-debug .metric {
        margin: 5px 0;
        display: flex;
        justify-content: space-between;
    }

    .analytics-debug .metric .value {
        color: #ffd700;
    }
`;

// Inject analytics CSS
const style = document.createElement('style');
style.textContent = analyticsCSS;
document.head.appendChild(style); 