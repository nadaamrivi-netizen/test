// Scroll to Top Button
class ScrollToTop {
    constructor() {
        this.createButton();
        this.addEventListeners();
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(button);
    }

    addEventListeners() {
        const button = document.querySelector('.scroll-to-top');
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});

// Add CSS for scroll to top button
const scrollToTopCSS = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .scroll-to-top:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .scroll-to-top i {
        transition: transform 0.3s ease;
    }

    .scroll-to-top:hover i {
        transform: translateY(-2px);
    }

    /* Dark mode styles */
    .dark-mode .scroll-to-top {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .dark-mode .scroll-to-top:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 1rem;
        }
    }

    /* Animation for button appearance */
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .scroll-to-top.visible {
        animation: slideInUp 0.3s ease forwards;
    }
`;

// Inject scroll to top CSS
const style = document.createElement('style');
style.textContent = scrollToTopCSS;
document.head.appendChild(style); 