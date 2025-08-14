// Dark Mode Toggle Feature
class DarkMode {
    constructor() {
        this.isDark = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.createToggle();
        this.applyTheme();
        this.addEventListeners();
    }

    createToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = `
            <div class="toggle-switch">
                <div class="toggle-slider">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon"></i>
                </div>
            </div>
        `;
        
        // Add to navbar
        const navbar = document.querySelector('.nav-container');
        if (navbar) {
            navbar.appendChild(toggle);
        }
    }

    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('darkMode', this.isDark);
        this.applyTheme();
    }

    addEventListeners() {
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
});

// Add CSS for dark mode
const darkModeCSS = `
    .dark-mode-toggle {
        cursor: pointer;
        margin-left: 1rem;
        position: relative;
        z-index: 1001;
    }

    .toggle-switch {
        width: 50px;
        height: 25px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 25px;
        position: relative;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .toggle-slider {
        width: 21px;
        height: 21px;
        background: linear-gradient(45deg, #ffd700, #ffed4e);
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        color: #333;
    }

    .dark-mode .toggle-slider {
        transform: translateX(25px);
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
    }

    .toggle-slider i {
        transition: all 0.3s ease;
    }

    .toggle-slider .fa-sun {
        opacity: 1;
        transform: scale(1);
    }

    .toggle-slider .fa-moon {
        opacity: 0;
        transform: scale(0);
        position: absolute;
    }

    .dark-mode .toggle-slider .fa-sun {
        opacity: 0;
        transform: scale(0);
    }

    .dark-mode .toggle-slider .fa-moon {
        opacity: 1;
        transform: scale(1);
    }

    /* Dark mode styles */
    .dark-mode {
        background: #1a1a1a;
        color: #ffffff;
    }

    .dark-mode .navbar {
        background: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(10px);
    }

    .dark-mode .nav-link {
        color: #ffffff;
    }

    .dark-mode .nav-link:hover {
        color: #667eea;
    }

    .dark-mode .hero {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }

    .dark-mode .about {
        background: #2d2d2d;
    }

    .dark-mode .about-text p {
        color: #cccccc;
    }

    .dark-mode .stat {
        background: #1a1a1a;
        color: #ffffff;
    }

    .dark-mode .stat p {
        color: #cccccc;
    }

    .dark-mode .skills {
        background: #1a1a1a;
    }

    .dark-mode .skill-category {
        background: #2d2d2d;
    }

    .dark-mode .skill-category h3 {
        color: #ffffff;
    }

    .dark-mode .skill-name {
        color: #cccccc;
    }

    .dark-mode .skill-bar {
        background: #1a1a1a;
    }

    .dark-mode .projects {
        background: #2d2d2d;
    }

    .dark-mode .project-card {
        background: #1a1a1a;
        color: #ffffff;
    }

    .dark-mode .project-content h3 {
        color: #ffffff;
    }

    .dark-mode .project-content p {
        color: #cccccc;
    }

    .dark-mode .contact {
        background: #1a1a1a;
    }

    .dark-mode .contact-info h3 {
        color: #ffffff;
    }

    .dark-mode .contact-info p {
        color: #cccccc;
    }

    .dark-mode .contact-item {
        background: #2d2d2d;
    }

    .dark-mode .contact-item h4 {
        color: #ffffff;
    }

    .dark-mode .contact-item p {
        color: #cccccc;
    }

    .dark-mode .contact-form {
        background: #2d2d2d;
    }

    .dark-mode .form-group input,
    .dark-mode .form-group textarea {
        background: #1a1a1a;
        border-color: #444444;
        color: #ffffff;
    }

    .dark-mode .form-group input:focus,
    .dark-mode .form-group textarea:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .dark-mode .footer {
        background: #1a1a1a;
    }

    /* Smooth transitions for all elements */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    /* Custom scrollbar for dark mode */
    .dark-mode ::-webkit-scrollbar-track {
        background: #2d2d2d;
    }

    .dark-mode ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Mobile responsive for dark mode toggle */
    @media (max-width: 768px) {
        .dark-mode-toggle {
            margin-left: 0.5rem;
        }
        
        .toggle-switch {
            width: 40px;
            height: 20px;
        }
        
        .toggle-slider {
            width: 16px;
            height: 16px;
            font-size: 0.7rem;
        }
        
        .dark-mode .toggle-slider {
            transform: translateX(20px);
        }
    }
`;

// Inject dark mode CSS
const style = document.createElement('style');
style.textContent = darkModeCSS;
document.head.appendChild(style); 