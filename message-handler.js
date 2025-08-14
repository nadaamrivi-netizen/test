// Message Handler for Portfolio Contact Form
class MessageHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.loadExistingMessages();
    }

    setupContactForm() {
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const messageData = {
            id: Date.now(),
            name: formData.get('name') || form.querySelector('input[type="text"]')?.value || 'Anonymous',
            email: formData.get('email') || form.querySelector('input[type="email"]')?.value || 'no-email@example.com',
            subject: formData.get('subject') || form.querySelector('input[placeholder*="Subjek"]')?.value || 'Pesan dari Website',
            message: formData.get('message') || form.querySelector('textarea')?.value || 'Tidak ada pesan',
            date: new Date().toISOString(),
            read: false
        };

        // Validate required fields
        if (!messageData.name || !messageData.email || !messageData.message) {
            this.showNotification('Mohon isi semua field yang diperlukan!', 'error');
            return;
        }

        // Save message
        this.saveMessage(messageData);

        // Show success message
        this.showNotification('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.', 'success');

        // Reset form
        form.reset();

        // Optional: Send to server (if you have a backend)
        this.sendToServer(messageData);
    }

    saveMessage(messageData) {
        // Get existing messages
        let messages = this.getMessages();
        
        // Add new message
        messages.unshift(messageData);
        
        // Save back to localStorage
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        
        // Update message count if admin panel is open
        this.updateMessageCount();
    }

    getMessages() {
        const savedMessages = localStorage.getItem('portfolioMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    }

    loadExistingMessages() {
        // This ensures the message storage exists
        if (!localStorage.getItem('portfolioMessages')) {
            localStorage.setItem('portfolioMessages', JSON.stringify([]));
        }
    }

    updateMessageCount() {
        // Update message count in admin panel if it exists
        const messageCount = document.getElementById('messageCount');
        if (messageCount) {
            const messages = this.getMessages();
            const unreadCount = messages.filter(msg => !msg.read).length;
            messageCount.textContent = unreadCount;
            messageCount.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
    }

    sendToServer(messageData) {
        // This is where you would send the message to your server
        // For now, we'll just log it to console
        console.log('Message to be sent to server:', messageData);
        
        // Example of how you might send to a server:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        */
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Add notification animations to CSS
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize message handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new MessageHandler();
        console.log('✅ Message handler initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing message handler:', error);
    }
});

// Export for use in other scripts
window.MessageHandler = MessageHandler; 