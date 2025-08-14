// PWA Registration and Installation
class PWA {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.addInstallListener();
        this.addBeforeInstallPrompt();
        this.checkForUpdate();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                        this.setupUpdateListener(registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    setupUpdateListener(registration) {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateNotification();
                }
            });
        });
    }

    addInstallListener() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
        });
    }

    addBeforeInstallPrompt() {
        let installButton = document.querySelector('.install-pwa-btn');
        if (!installButton) {
            installButton = this.createInstallButton();
        }

        installButton.addEventListener('click', () => {
            this.installPWA();
        });
    }

    createInstallButton() {
        const button = document.createElement('button');
        button.className = 'install-pwa-btn';
        button.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Install App</span>
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            display: none;
            align-items: center;
            gap: 8px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        });

        document.body.appendChild(button);
        return button;
    }

    showInstallButton() {
        const button = document.querySelector('.install-pwa-btn');
        if (button) {
            button.style.display = 'flex';
            button.style.animation = 'slideInUp 0.3s ease';
        }
    }

    hideInstallButton() {
        const button = document.querySelector('.install-pwa-btn');
        if (button) {
            button.style.display = 'none';
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button class="update-btn">Update</button>
                <button class="close-btn">×</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        const updateBtn = notification.querySelector('.update-btn');
        const closeBtn = notification.querySelector('.close-btn');

        updateBtn.addEventListener('click', () => {
            window.location.reload();
        });

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    checkForUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    registration.update();
                }
            });
        }
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                }
            });
        }
    }

    // Show notification
    showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const defaultOptions = {
                icon: '/favicon-192x192.png',
                badge: '/favicon-32x32.png',
                vibrate: [100, 50, 100]
            };
            
            new Notification(title, { ...defaultOptions, ...options });
        }
    }
}

// Initialize PWA
document.addEventListener('DOMContentLoaded', () => {
    new PWA();
});

// Add CSS for PWA elements
const pwaCSS = `
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

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .update-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .update-btn, .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .update-btn:hover, .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .close-btn {
        padding: 5px 8px;
        font-size: 1.2rem;
        line-height: 1;
    }

    /* Dark mode styles */
    .dark-mode .install-pwa-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .install-pwa-btn {
            bottom: 80px;
            right: 20px;
            padding: 10px 16px;
            font-size: 0.8rem;
        }
    }
`;

// Inject PWA CSS
const style = document.createElement('style');
style.textContent = pwaCSS;
document.head.appendChild(style); 