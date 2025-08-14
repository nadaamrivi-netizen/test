// Advanced Loading Animation
class LoadingAnimation {
    constructor() {
        this.progress = 0;
        this.createLoader();
        this.startLoading();
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'advanced-loader';
        loader.innerHTML = `
            <div class="loader-container">
                <div class="loader-logo">
                    <div class="logo-animation">
                        <div class="logo-circle">
                            <span>P</span>
                        </div>
                        <div class="logo-rings">
                            <div class="ring ring-1"></div>
                            <div class="ring ring-2"></div>
                            <div class="ring ring-3"></div>
                        </div>
                    </div>
                </div>
                <div class="loader-text">
                    <h2>Loading Portfolio</h2>
                    <p>Preparing amazing experience...</p>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">0%</div>
                </div>
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    startLoading() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const loader = document.querySelector('.advanced-loader');

        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress > 100) this.progress = 100;

            progressFill.style.width = `${this.progress}%`;
            progressText.textContent = `${Math.round(this.progress)}%`;

            if (this.progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.remove();
                        this.initializePortfolio();
                    }, 500);
                }, 500);
            }
        }, 100);
    }

    initializePortfolio() {
        // Trigger entrance animations
        document.body.classList.add('portfolio-loaded');
        
        // Add entrance animation to main sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.2}s`;
            section.classList.add('entrance-animation');
        });
    }
}

// Initialize loading animation
document.addEventListener('DOMContentLoaded', () => {
    new LoadingAnimation();
});

// Add CSS for advanced loading animation
const loadingCSS = `
    .advanced-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }

    .advanced-loader.fade-out {
        opacity: 0;
    }

    .loader-container {
        text-align: center;
        color: white;
    }

    .loader-logo {
        margin-bottom: 2rem;
        position: relative;
    }

    .logo-animation {
        position: relative;
        display: inline-block;
    }

    .logo-circle {
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        position: relative;
        z-index: 2;
        animation: logoPulse 2s infinite;
    }

    .logo-circle span {
        font-size: 3rem;
        font-weight: 700;
        color: white;
        animation: logoRotate 3s linear infinite;
    }

    .logo-rings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
    }

    .ring {
        position: absolute;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: ringExpand 2s infinite;
    }

    .ring-1 {
        width: 120px;
        height: 120px;
        animation-delay: 0s;
    }

    .ring-2 {
        width: 140px;
        height: 140px;
        animation-delay: 0.5s;
    }

    .ring-3 {
        width: 160px;
        height: 160px;
        animation-delay: 1s;
    }

    .loader-text h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        animation: textGlow 2s ease-in-out infinite alternate;
    }

    .loader-text p {
        font-size: 1.1rem;
        opacity: 0.8;
        margin-bottom: 2rem;
    }

    .progress-container {
        margin-bottom: 2rem;
    }

    .progress-bar {
        width: 300px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
        margin: 0 auto 1rem;
        position: relative;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd700, #ffed4e);
        border-radius: 3px;
        transition: width 0.3s ease;
        position: relative;
    }

    .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: progressShimmer 1.5s infinite;
    }

    .progress-text {
        font-size: 1.2rem;
        font-weight: 600;
        color: #ffd700;
    }

    .loading-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
    }

    .loading-dots span {
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        animation: dotsBounce 1.4s infinite ease-in-out both;
    }

    .loading-dots span:nth-child(1) {
        animation-delay: -0.32s;
    }

    .loading-dots span:nth-child(2) {
        animation-delay: -0.16s;
    }

    /* Animations */
    @keyframes logoPulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
        }
    }

    @keyframes logoRotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes ringExpand {
        0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
        }
    }

    @keyframes textGlow {
        0% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        }
    }

    @keyframes progressShimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    @keyframes dotsBounce {
        0%, 80%, 100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }

    /* Portfolio entrance animations */
    .portfolio-loaded section {
        opacity: 0;
        transform: translateY(30px);
    }

    .entrance-animation {
        animation: entranceFadeIn 0.8s ease forwards;
    }

    @keyframes entranceFadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .logo-circle {
            width: 80px;
            height: 80px;
        }

        .logo-circle span {
            font-size: 2.5rem;
        }

        .ring-1 {
            width: 100px;
            height: 100px;
        }

        .ring-2 {
            width: 120px;
            height: 120px;
        }

        .ring-3 {
            width: 140px;
            height: 140px;
        }

        .progress-bar {
            width: 250px;
        }

        .loader-text h2 {
            font-size: 1.5rem;
        }
    }
`;

// Inject loading CSS
const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style); 