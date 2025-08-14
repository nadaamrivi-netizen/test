// Portfolio Configuration
const PORTFOLIO_CONFIG = {
    // Personal Information
    personal: {
        name: "Nada Cahya Amrivi",
        title: "Mahasiswa Sistem Informasi UIN Imam Bonjol Padang",
        description: "Saya adalah salah satu mahasiswa UIN Imam Bonjol Padang dengan jurusan Sistem Informasi yang passionate dalam menciptakan pengalaman digital yang menarik dan fungsional.",
        email: "nadaamrivi@gmail.com",
        phone: "082171809033",
        location: "Padang, Indonesia",
        avatar: "profile.jpg" // Path to your profile image
    },

    // Social Media Links
    social: {
        linkedin: "https://www.linkedin.com/in/nada-cahya-amrivi-a59515346",
        github: "https://github.com/nadaamrivi-netizen",
        tiktok: "https://www.tiktok.com/@nadreyn?is_from_webapp=1&sender_device=pc",
        instagram: "https://www.instagram.com/nadachy_/?utm_source=ig_web_button_share_sheet"
    },

    // Skills Configuration
    skills: {
        frontend: [
            { name: "HTML5", level: 95 },
            { name: "CSS3", level: 90 },
            { name: "JavaScript", level: 85 },
            { name: "React.js", level: 80 },
            { name: "Vue.js", level: 75 },
            { name: "Angular", level: 70 }
        ],
        backend: [
            { name: "Node.js", level: 85 },
            { name: "PHP", level: 80 },
            { name: "Python", level: 75 },
            { name: "MySQL", level: 80 },
            { name: "MongoDB", level: 70 },
            { name: "PostgreSQL", level: 65 }
        ],
        tools: [
            { name: "Git", level: 90 },
            { name: "Docker", level: 75 },
            { name: "AWS", level: 70 },
            { name: "Figma", level: 100 },
            { name: "Photoshop", level: 65 },
            { name: "VS Code", level: 95 }
        ]
    },

    // Projects Configuration
    projects: [
        {
            title: "E-Commerce Platform",
            description: "Platform e-commerce modern dengan fitur pembayaran online, manajemen produk, dan dashboard admin.",
            image: "ecommerce.jpg",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            demo: "https://demo-ecommerce.com",
            code: "https://github.com/yourusername/ecommerce",
            icon: "fas fa-shopping-cart"
        },
        {
            title: "Task Management App",
            description: "Aplikasi manajemen tugas dengan fitur drag & drop, notifikasi real-time, dan kolaborasi tim.",
            image: "taskapp.jpg",
            technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
            demo: "https://demo-taskapp.com",
            code: "https://github.com/yourusername/taskapp",
            icon: "fas fa-tasks"
        },
        {
            title: "Analytics Dashboard",
            description: "Dashboard analitik dengan visualisasi data interaktif, laporan real-time, dan export data.",
            image: "analytics.jpg",
            technologies: ["Angular", "D3.js", "Express.js"],
            demo: "https://demo-analytics.com",
            code: "https://github.com/yourusername/analytics",
            icon: "fas fa-chart-line"
        },
        {
            title: "Mobile App",
            description: "Aplikasi mobile untuk fitness tracking dengan fitur GPS, social sharing, dan gamification.",
            image: "mobileapp.jpg",
            technologies: ["React Native", "Redux", "Node.js"],
            demo: "https://demo-mobileapp.com",
            code: "https://github.com/yourusername/mobileapp",
            icon: "fas fa-mobile-alt"
        }
    ],

    // Statistics
    stats: [
        { number: 2, label: "Tahun Belajar", suffix: "+" },
        { number: 15, label: "Proyek Selesai", suffix: "+" },
        { number: 10, label: "Teknologi Dikuasai", suffix: "+" }
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
        },
        dark: {
            background: "#1a1a1a",
            surface: "#2d2d2d",
            text: "#ffffff",
            textSecondary: "#cccccc"
        }
    },

    // Animation Settings
    animations: {
        enabled: true,
        duration: 800,
        delay: 200,
        easing: "ease"
    },

    // Features Configuration
    features: {
        darkMode: true,
        particles: true,
        scrollToTop: true,
        loadingAnimation: true,
        smoothScroll: true,
        cursorTrail: true
    },

    // Contact Form Configuration
    contact: {
        enabled: true,
        emailService: "formspree", // or "netlify", "emailjs"
        formId: "your-form-id", // for Formspree or Netlify
        emailJsConfig: {
            serviceId: "your-service-id",
            templateId: "your-template-id",
            userId: "your-user-id"
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PORTFOLIO_CONFIG;
} else {
    window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;
}

// Configuration Helper Functions
class ConfigHelper {
    static getPersonalInfo() {
        return PORTFOLIO_CONFIG.personal;
    }

    static getSocialLinks() {
        return PORTFOLIO_CONFIG.social;
    }

    static getSkills() {
        return PORTFOLIO_CONFIG.skills;
    }

    static getProjects() {
        return PORTFOLIO_CONFIG.projects;
    }

    static getStats() {
        return PORTFOLIO_CONFIG.stats;
    }

    static getTheme() {
        return PORTFOLIO_CONFIG.theme;
    }

    static isFeatureEnabled(feature) {
        return PORTFOLIO_CONFIG.features[feature] || false;
    }

    static getAnimationSettings() {
        return PORTFOLIO_CONFIG.animations;
    }

    static getContactConfig() {
        return PORTFOLIO_CONFIG.contact;
    }

    // Update configuration dynamically
    static updateConfig(newConfig) {
        Object.assign(PORTFOLIO_CONFIG, newConfig);
    }

    // Get specific skill category
    static getSkillCategory(category) {
        return PORTFOLIO_CONFIG.skills[category] || [];
    }

    // Get project by index
    static getProject(index) {
        return PORTFOLIO_CONFIG.projects[index] || null;
    }

    // Get theme color
    static getThemeColor(type, property) {
        return PORTFOLIO_CONFIG.theme[type]?.[property] || null;
    }
}

// Make ConfigHelper available globally
window.ConfigHelper = ConfigHelper;

// Auto-populate content based on configuration
document.addEventListener('DOMContentLoaded', () => {
    // Populate personal information
    const personal = ConfigHelper.getPersonalInfo();
    document.querySelectorAll('[data-config="name"]').forEach(el => {
        el.textContent = personal.name;
    });
    document.querySelectorAll('[data-config="title"]').forEach(el => {
        el.textContent = personal.title;
    });
    document.querySelectorAll('[data-config="description"]').forEach(el => {
        el.textContent = personal.description;
    });

    // Populate contact information
    document.querySelectorAll('[data-config="email"]').forEach(el => {
        el.textContent = personal.email;
        if (el.tagName === 'A') {
            el.href = `mailto:${personal.email}`;
        }
    });
    document.querySelectorAll('[data-config="phone"]').forEach(el => {
        el.textContent = personal.phone;
        if (el.tagName === 'A') {
            el.href = `tel:${personal.phone}`;
        }
    });
    document.querySelectorAll('[data-config="location"]').forEach(el => {
        el.textContent = personal.location;
    });

    // Populate social links
    const social = ConfigHelper.getSocialLinks();
    Object.keys(social).forEach(platform => {
        document.querySelectorAll(`[data-config="social-${platform}"]`).forEach(el => {
            el.href = social[platform];
        });
    });
}); 