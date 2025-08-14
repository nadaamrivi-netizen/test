// Performance Optimization and Lazy Loading
class PerformanceOptimizer {
    constructor() {
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupResourceHints();
        this.optimizeFonts();
        this.setupServiceWorker();
        this.monitorPerformance();
    }

    setupLazyLoading() {
        // Lazy load images
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.removeAttribute('data-src');
                        this.intersectionObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.intersectionObserver.observe(img);
        });

        // Lazy load background images
        this.lazyLoadBackgrounds();
    }

    lazyLoadBackgrounds() {
        const backgroundObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const bgImage = element.dataset.bgImage;
                    if (bgImage) {
                        element.style.backgroundImage = `url(${bgImage})`;
                        element.classList.remove('lazy-bg');
                        element.removeAttribute('data-bg-image');
                        backgroundObserver.unobserve(element);
                    }
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        document.querySelectorAll('[data-bg-image]').forEach(element => {
            backgroundObserver.observe(element);
        });
    }

    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                img.alt = 'Image not found';
            });
        });

        // Optimize image sizes based on viewport
        this.optimizeImageSizes();
    }

    optimizeImageSizes() {
        const images = document.querySelectorAll('img[data-srcset]');
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (srcset) {
                img.srcset = srcset;
                img.sizes = img.dataset.sizes || '100vw';
            }
        });
    }

    setupResourceHints() {
        // Add preload for critical resources
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Add DNS prefetch for external domains
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    optimizeFonts() {
        // Font loading optimization
        if ('fonts' in document) {
            // Preload critical fonts
            const criticalFonts = [
                new FontFace('Poppins', 'url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2)', {
                    weight: '400',
                    style: 'normal'
                }),
                new FontFace('Poppins', 'url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2)', {
                    weight: '600',
                    style: 'normal'
                })
            ];

            Promise.all(criticalFonts.map(font => font.load()))
                .then(fonts => {
                    fonts.forEach(font => document.fonts.add(font));
                })
                .catch(err => {
                    console.warn('Font loading failed:', err);
                });
        }

        // Add font-display: swap to font loading
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=swap')) {
                link.href += '&display=swap';
            }
        });
    }

    setupServiceWorker() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered for performance optimization');
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        this.monitorFCP();
    }

    monitorLCP() {
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            // Send to analytics
            if (window.analytics) {
                window.analytics.trackEvent('LCP', { value: lastEntry.startTime });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }

    monitorFID() {
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
                
                // Send to analytics
                if (window.analytics) {
                    window.analytics.trackEvent('FID', { 
                        value: entry.processingStart - entry.startTime 
                    });
                }
                break;
            }
        }).observe({ entryTypes: ['first-input'] });
    }

    monitorCLS() {
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
            
            // Send to analytics
            if (window.analytics) {
                window.analytics.trackEvent('CLS', { value: clsValue });
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    monitorFCP() {
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    console.log('FCP:', entry.startTime);
                    
                    // Send to analytics
                    if (window.analytics) {
                        window.analytics.trackEvent('FCP', { value: entry.startTime });
                    }
                }
            });
        }).observe({ entryTypes: ['paint'] });
    }

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for performance
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize scroll events
    optimizeScrollEvents() {
        const scrollHandler = this.throttle(() => {
            // Handle scroll events efficiently
        }, 16); // ~60fps

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // Optimize resize events
    optimizeResizeEvents() {
        const resizeHandler = this.debounce(() => {
            // Handle resize events efficiently
        }, 250);

        window.addEventListener('resize', resizeHandler, { passive: true });
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            '/styles.css',
            '/script.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Optimize animations
    optimizeAnimations() {
        // Use transform and opacity for better performance
        const animatedElements = document.querySelectorAll('.animate, .fade-in, .slide-in');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });

        // Clean up will-change after animation
        setTimeout(() => {
            animatedElements.forEach(element => {
                element.style.willChange = 'auto';
            });
        }, 1000);
    }

    // Memory management
    cleanupMemory() {
        // Remove event listeners for elements that no longer exist
        const cleanup = () => {
            // Clean up any stored references
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
        };

        // Clean up on page unload
        window.addEventListener('beforeunload', cleanup);
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Add performance optimization CSS
const performanceCSS = `
    /* Lazy loading styles */
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .lazy.loaded {
        opacity: 1;
    }

    .lazy-bg {
        background-image: none !important;
    }

    /* Performance optimizations */
    .animate {
        will-change: transform, opacity;
    }

    /* Optimize paint and layout */
    .optimize-paint {
        transform: translateZ(0);
        backface-visibility: hidden;
    }

    /* Reduce repaints */
    .reduce-repaint {
        transform: translate3d(0, 0, 0);
    }

    /* Optimize for mobile */
    @media (max-width: 768px) {
        .mobile-optimize {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
        }
    }

    /* Loading states */
    .loading {
        position: relative;
        overflow: hidden;
    }

    .loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading-shimmer 1.5s infinite;
    }

    @keyframes loading-shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }

    /* Optimize images */
    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    /* Optimize fonts */
    body {
        font-display: swap;
    }

    /* Reduce motion for performance */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Inject performance CSS
const style = document.createElement('style');
style.textContent = performanceCSS;
document.head.appendChild(style); 