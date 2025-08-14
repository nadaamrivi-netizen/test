// Advanced Smooth Scroll with Easing
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollIndicator();
        this.addSmoothScroll();
        this.addScrollProgress();
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = `
            <div class="scroll-progress-bar">
                <div class="scroll-progress-fill"></div>
            </div>
            <div class="scroll-percentage">0%</div>
        `;
        document.body.appendChild(indicator);
    }

    addSmoothScroll() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                }
            });
        });

        // Add smooth scroll to window
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
        });
    }

    scrollToElement(element, duration = 1000) {
        const targetPosition = element.offsetTop - 70; // Account for navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation.bind(this));
        }

        requestAnimationFrame(animation.bind(this));
    }

    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressFill = document.querySelector('.scroll-progress-fill');
        const percentageText = document.querySelector('.scroll-percentage');
        
        if (progressFill && percentageText) {
            progressFill.style.width = `${scrollPercent}%`;
            percentageText.textContent = `${Math.round(scrollPercent)}%`;
        }
    }

    addScrollProgress() {
        // Add scroll progress to sections
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize smooth scroll
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
});

// Add CSS for smooth scroll features
const smoothScrollCSS = `
    .scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 10000;
        backdrop-filter: blur(10px);
    }

    .scroll-progress-bar {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .scroll-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        width: 0%;
        transition: width 0.1s ease;
        position: relative;
    }

    .scroll-progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: progressShimmer 2s infinite;
    }

    .scroll-percentage {
        position: absolute;
        top: 10px;
        right: 20px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }

    .scroll-indicator:hover .scroll-percentage {
        opacity: 1;
        transform: translateY(0);
    }

    /* Section visibility animations */
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }

    section.section-visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Enhanced scroll behavior */
    html {
        scroll-behavior: smooth;
        scroll-padding-top: 70px;
    }

    /* Custom scrollbar enhancements */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        transform: scale(1.1);
    }

    /* Dark mode styles */
    .dark-mode .scroll-indicator {
        background: rgba(0, 0, 0, 0.2);
    }

    .dark-mode .scroll-percentage {
        background: rgba(102, 126, 234, 0.8);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .scroll-indicator {
            height: 3px;
        }
        
        .scroll-percentage {
            font-size: 0.7rem;
            padding: 3px 6px;
        }
    }

    /* Animation for progress shimmer */
    @keyframes progressShimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    /* Enhanced section animations */
    @keyframes sectionSlideIn {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .section-visible {
        animation: sectionSlideIn 0.8s ease forwards;
    }

    /* Staggered animation for child elements */
    .section-visible .skill-category,
    .section-visible .project-card,
    .section-visible .stat {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }

    .section-visible .skill-category:nth-child(1) { animation-delay: 0.1s; }
    .section-visible .skill-category:nth-child(2) { animation-delay: 0.2s; }
    .section-visible .skill-category:nth-child(3) { animation-delay: 0.3s; }

    .section-visible .project-card:nth-child(1) { animation-delay: 0.1s; }
    .section-visible .project-card:nth-child(2) { animation-delay: 0.2s; }
    .section-visible .project-card:nth-child(3) { animation-delay: 0.3s; }
    .section-visible .project-card:nth-child(4) { animation-delay: 0.4s; }

    .section-visible .stat:nth-child(1) { animation-delay: 0.1s; }
    .section-visible .stat:nth-child(2) { animation-delay: 0.2s; }
    .section-visible .stat:nth-child(3) { animation-delay: 0.3s; }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject smooth scroll CSS
const style = document.createElement('style');
style.textContent = smoothScrollCSS;
document.head.appendChild(style); 