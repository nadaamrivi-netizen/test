# 📚 Documentation & API Reference

Dokumentasi lengkap untuk website portofolio dengan panduan penggunaan dan referensi API.

## 🏗️ Architecture Overview

### File Structure
```
portfolio-website/
├── index.html              # Main HTML file
├── styles.css              # Main CSS styles
├── script.js               # Main JavaScript
├── config.js               # Configuration file
├── dark-mode.js            # Dark mode functionality
├── scroll-to-top.js        # Scroll to top button
├── loading-animation.js    # Loading animations
├── smooth-scroll.js        # Smooth scrolling
├── particle-effects.js     # Particle animations
├── pwa.js                  # PWA functionality
├── analytics.js            # Analytics tracking
├── accessibility.js        # Accessibility features
├── performance.js          # Performance optimization
├── security.js             # Security features
├── testing.js              # Testing framework
├── sw.js                   # Service worker
├── site.webmanifest        # PWA manifest
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots
├── README.md               # Project documentation
├── deployment.md           # Deployment guide
├── maintenance.md          # Maintenance guide
└── documentation.md        # This file
```

### Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** CSS Grid, Flexbox, CSS Custom Properties
- **Animations:** CSS Animations, JavaScript Animations
- **PWA:** Service Workers, Web App Manifest
- **Performance:** Lazy Loading, Resource Optimization
- **Security:** CSP, XSS Protection, CSRF Protection
- **Testing:** Custom Testing Framework
- **Analytics:** Google Analytics, Custom Tracking

## ⚙️ Configuration

### Config.js Reference

```javascript
const PORTFOLIO_CONFIG = {
    // Personal Information
    personal: {
        name: "Your Name",
        title: "Your Title",
        description: "Your description",
        email: "your@email.com",
        phone: "+1234567890",
        location: "Your Location",
        avatar: "profile.jpg"
    },

    // Social Media Links
    social: {
        linkedin: "https://linkedin.com/in/yourprofile",
        github: "https://github.com/yourusername",
        twitter: "https://twitter.com/yourusername",
        instagram: "https://instagram.com/yourusername"
    },

    // Skills Configuration
    skills: {
        frontend: [
            { name: "HTML5", level: 95 },
            { name: "CSS3", level: 90 },
            // ... more skills
        ],
        backend: [
            { name: "Node.js", level: 85 },
            // ... more skills
        ],
        tools: [
            { name: "Git", level: 90 },
            // ... more skills
        ]
    },

    // Projects Configuration
    projects: [
        {
            title: "Project Name",
            description: "Project description",
            image: "project.jpg",
            technologies: ["React", "Node.js"],
            demo: "https://demo-link.com",
            code: "https://github-link.com",
            icon: "fas fa-project-icon"
        }
    ],

    // Statistics
    stats: [
        { number: 3, label: "Years Experience", suffix: "+" },
        { number: 50, label: "Projects Completed", suffix: "+" },
        { number: 30, label: "Happy Clients", suffix: "+" }
    ],

    // Theme Configuration
    theme: {
        primary: {
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#667eea"
        },
        secondary: {
            gradient: "linear-gradient(45deg, #ffd700, #ffed4e)",
            color: "#ffd700"
        }
    },

    // Features Configuration
    features: {
        darkMode: true,
        particles: true,
        scrollToTop: true,
        loadingAnimation: true,
        smoothScroll: true,
        cursorTrail: true
    }
};
```

## 🎨 Styling System

### CSS Custom Properties

```css
:root {
    /* Primary Colors */
    --primary-color: #667eea;
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    /* Secondary Colors */
    --secondary-color: #ffd700;
    --secondary-gradient: linear-gradient(45deg, #ffd700, #ffed4e);
    
    /* Neutral Colors */
    --text-primary: #333333;
    --text-secondary: #666666;
    --background-primary: #ffffff;
    --background-secondary: #f8f9fa;
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    
    /* Typography */
    --font-family: 'Poppins', sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;
    
    /* Border Radius */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.5rem;
    --border-radius-lg: 1rem;
    --border-radius-xl: 2rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### Component Classes

```css
/* Button Components */
.btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    font-weight: 600;
    transition: var(--transition-normal);
    cursor: pointer;
    border: none;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.btn-primary {
    background: var(--primary-gradient);
    color: white;
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* Card Components */
.card {
    background: var(--background-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
}

/* Section Components */
.section {
    padding: var(--spacing-xl) 0;
}

.section-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    text-align: center;
    margin-bottom: var(--spacing-xl);
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

## 🔧 JavaScript API Reference

### Core Functions

#### ConfigHelper Class
```javascript
// Get personal information
const personal = ConfigHelper.getPersonalInfo();

// Get social links
const social = ConfigHelper.getSocialLinks();

// Get skills by category
const frontendSkills = ConfigHelper.getSkillCategory('frontend');

// Get project by index
const project = ConfigHelper.getProject(0);

// Update configuration
ConfigHelper.updateConfig({
    personal: {
        name: "New Name"
    }
});
```

#### Animation Functions
```javascript
// Fade in animation
function fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
        element.style.opacity = '1';
    }, 100);
}

// Slide in animation
function slideIn(element, direction = 'up', duration = 500) {
    const transforms = {
        up: 'translateY(30px)',
        down: 'translateY(-30px)',
        left: 'translateX(30px)',
        right: 'translateX(-30px)'
    };
    
    element.style.transform = transforms[direction];
    element.style.opacity = '0';
    element.style.transition = `all ${duration}ms ease`;
    
    setTimeout(() => {
        element.style.transform = 'translate(0, 0)';
        element.style.opacity = '1';
    }, 100);
}

// Typing effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}
```

#### Utility Functions
```javascript
// Debounce function
function debounce(func, wait) {
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

// Throttle function
function throttle(func, limit) {
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

// Smooth scroll to element
function scrollToElement(element, duration = 1000) {
    const targetPosition = element.offsetTop - 70;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
}
```

## 🎯 Component API

### Dark Mode Toggle
```javascript
// Toggle dark mode
document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check dark mode preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
}
```

### Scroll to Top Button
```javascript
// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
    } else {
        scrollBtn.classList.remove('visible');
    }
});

// Scroll to top functionality
document.querySelector('.scroll-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
```

### Contact Form
```javascript
// Form validation
const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    if (validateForm(data)) {
        submitForm(data);
    }
});

// Form validation function
function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (!data.message.trim()) {
        errors.push('Message is required');
    }
    
    return errors.length === 0;
}
```

## 🧪 Testing API

### Test Framework
```javascript
// Create a test
testingSuite.test('Test Name', () => {
    // Test logic here
    testingSuite.assertEqual(actual, expected, 'Message');
    testingSuite.assertTrue(condition, 'Message');
    testingSuite.assertFalse(condition, 'Message');
    testingSuite.assertExists(element, 'Message');
});

// Run all tests
testingSuite.runAllTests();

// Get test results
const results = testingSuite.results;

// Export test results
testingSuite.exportTestResults();
```

### Performance Testing
```javascript
// Get performance metrics
const metrics = testingSuite.getPerformanceMetrics();
console.log('Page Load:', metrics.pageLoad);
console.log('Memory Usage:', metrics.memory);
console.log('FPS:', metrics.fps);

// Check accessibility
const a11yIssues = testingSuite.checkAccessibility();
console.log('Accessibility Issues:', a11yIssues.length);
console.log('Accessibility Score:', testingSuite.calculateAccessibilityScore(a11yIssues));
```

## 🔒 Security API

### Input Sanitization
```javascript
// Sanitize user input
const sanitizedInput = securityManager.sanitizeInput(userInput);

// Sanitize HTML content
const sanitizedHTML = securityManager.sanitizeHTML(htmlContent);

// Validate email
const isValidEmail = securityManager.validateEmail(email);

// Validate phone number
const isValidPhone = securityManager.validatePhone(phone);

// Validate URL
const isValidURL = securityManager.validateURL(url);
```

### Form Validation
```javascript
// Validate form
const isValid = securityManager.validateForm(formElement);

// Check rate limit
const canSubmit = securityManager.checkRateLimit('form-id', 5, 60000);

// Generate CSRF token
const token = securityManager.generateCSRFToken();

// Validate CSRF token
const isValidToken = securityManager.validateCSRFToken(token);
```

## 📊 Analytics API

### Event Tracking
```javascript
// Track custom event
analytics.trackEvent('Button Click', {
    buttonText: 'Contact Me',
    pageSection: 'hero'
});

// Track page view
analytics.trackEvent('Page View', {
    page: 'home',
    referrer: document.referrer
});

// Track form submission
analytics.trackEvent('Form Submission', {
    formId: 'contact-form',
    formAction: 'contact'
});
```

### Performance Tracking
```javascript
// Get performance summary
const performance = analytics.getPerformanceSummary();

// Export analytics data
analytics.exportAnalyticsData();

// Log metric
analytics.logMetric('Custom Metric', value);
```

## 🎨 Customization Guide

### Adding New Sections

1. **HTML Structure:**
```html
<section id="new-section" class="section">
    <div class="container">
        <h2 class="section-title">New Section</h2>
        <div class="section-content">
            <!-- Your content here -->
        </div>
    </div>
</section>
```

2. **CSS Styling:**
```css
#new-section {
    background: var(--background-secondary);
}

#new-section .section-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}
```

3. **JavaScript Functionality:**
```javascript
// Add to script.js
function initNewSection() {
    const section = document.querySelector('#new-section');
    if (section) {
        // Add your functionality here
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initNewSection);
```

### Adding New Animations

```css
/* Define animation */
@keyframes customAnimation {
    0% {
        opacity: 0;
        transform: scale(0.8);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

/* Apply animation */
.animated-element {
    animation: customAnimation 0.6s ease forwards;
}
```

### Adding New Features

1. **Create feature file:**
```javascript
// new-feature.js
class NewFeature {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize feature
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new NewFeature();
});
```

2. **Add to HTML:**
```html
<script src="new-feature.js"></script>
```

## 🚀 Performance Optimization

### Lazy Loading
```html
<!-- Lazy load images -->
<img data-src="image.jpg" alt="Description" class="lazy">

<!-- Lazy load background images -->
<div data-bg-image="background.jpg" class="lazy-bg"></div>
```

### Resource Optimization
```html
<!-- Preload critical resources -->
<link rel="preload" href="styles.css" as="style">
<link rel="preload" href="script.js" as="script">

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

### Code Splitting
```javascript
// Load features on demand
function loadFeature(featureName) {
    return import(`./features/${featureName}.js`)
        .then(module => {
            module.default();
        })
        .catch(error => {
            console.error('Feature load failed:', error);
        });
}

// Usage
loadFeature('advanced-animations');
```

## 🔧 Troubleshooting

### Common Issues

1. **Animations not working:**
```javascript
// Check if animations are enabled
if (PORTFOLIO_CONFIG.animations.enabled) {
    // Run animations
}
```

2. **Dark mode not persisting:**
```javascript
// Check localStorage
const darkMode = localStorage.getItem('darkMode');
if (darkMode === 'true') {
    document.body.classList.add('dark-mode');
}
```

3. **PWA not installing:**
```javascript
// Check service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registered');
        })
        .catch(error => {
            console.log('SW registration failed:', error);
        });
}
```

### Debug Mode

Enable debug mode with keyboard shortcut:
```javascript
// Ctrl/Cmd + Shift + D
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        testingSuite.toggleDebugMode();
    }
});
```

## 📚 Additional Resources

### Documentation Links
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

### Tools & Services
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

**Dokumentasi ini akan membantu Anda memahami dan mengkustomisasi website portofolio dengan mudah! 📚✨** 