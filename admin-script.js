// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'personal-info';
        this.messages = [];
        this.projects = [];
        this.analytics = {
            totalViews: 0,
            totalMessages: 0,
            avgTime: 0,
            totalClicks: 0
        };
        this.init();
    }

    init() {
        try {
            this.loadData();
            this.setupEventListeners();
            this.loadMessages();
            this.loadProjects();
            this.updateAnalytics();
            this.showSection('personal-info');
        } catch (error) {
            console.error('Error initializing AdminPanel:', error);
        }
    }

    setupEventListeners() {
        // Skill sliders
        document.querySelectorAll('.skill-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const skillName = e.target.dataset.skill;
                const valueDisplay = e.target.parentElement.querySelector('.skill-value');
                valueDisplay.textContent = value + '%';
            });
        });

        // New skill slider
        const newSkillSlider = document.getElementById('newSkillLevel');
        const newSkillValue = document.getElementById('newSkillValue');
        if (newSkillSlider) {
            newSkillSlider.addEventListener('input', (e) => {
                newSkillValue.textContent = e.target.value + '%';
            });
        }

        // Form inputs
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('change', () => {
                this.saveToLocalStorage();
            });
        });

        // Auto-save on input
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                this.saveToLocalStorage();
            });
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to nav item
        const navItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentSection = sectionId;

        // Load section-specific data
        if (sectionId === 'messages') {
            this.loadMessages();
        } else if (sectionId === 'projects') {
            this.loadProjects();
        } else if (sectionId === 'analytics') {
            this.updateAnalytics();
        }
    }

    loadData() {
        // Load from localStorage
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.populateFormFields(data);
        }
    }

    populateFormFields(data) {
        // Personal info
        if (data.personal) {
            Object.keys(data.personal).forEach(key => {
                const element = document.getElementById(key);
                if (element && data.personal[key]) {
                    element.value = data.personal[key];
                }
            });
        }

        // Social media
        if (data.social) {
            Object.keys(data.social).forEach(key => {
                const element = document.getElementById(key);
                if (element && data.social[key]) {
                    element.value = data.social[key];
                }
            });
        }

        // Skills
        if (data.skills) {
            Object.keys(data.skills).forEach(category => {
                data.skills[category].forEach(skill => {
                    const slider = document.querySelector(`[data-skill="${skill.name}"]`);
                    if (slider) {
                        slider.value = skill.level;
                        const valueDisplay = slider.parentElement.querySelector('.skill-value');
                        if (valueDisplay) {
                            valueDisplay.textContent = skill.level + '%';
                        }
                    }
                });
            });
        }
    }

    saveToLocalStorage() {
        const data = {
            personal: {
                name: document.getElementById('name')?.value || '',
                title: document.getElementById('title')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                location: document.getElementById('location')?.value || '',
                description: document.getElementById('description')?.value || '',
                about: document.getElementById('about')?.value || ''
            },
            social: {
                linkedin: document.getElementById('linkedin')?.value || '',
                github: document.getElementById('github')?.value || '',
                instagram: document.getElementById('instagram')?.value || '',
                tiktok: document.getElementById('tiktok')?.value || ''
            },
            skills: this.getSkillsData()
        };

        localStorage.setItem('portfolioData', JSON.stringify(data));
        this.showMessage('Data berhasil disimpan!', 'success');
    }

    getSkillsData() {
        const skills = {
            frontend: [],
            backend: [],
            tools: []
        };

        document.querySelectorAll('.skill-slider').forEach(slider => {
            const skillName = slider.dataset.skill;
            const level = parseInt(slider.value);
            const category = this.getSkillCategory(skillName);
            
            if (category) {
                skills[category].push({
                    name: skillName,
                    level: level
                });
            }
        });

        return skills;
    }

    getSkillCategory(skillName) {
        const frontendSkills = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Vue.js', 'Angular'];
        const backendSkills = ['Node.js', 'PHP', 'Python', 'MySQL', 'MongoDB', 'PostgreSQL'];
        const toolsSkills = ['Git', 'Docker', 'AWS', 'Figma', 'Photoshop', 'VS Code'];

        if (frontendSkills.includes(skillName)) return 'frontend';
        if (backendSkills.includes(skillName)) return 'backend';
        if (toolsSkills.includes(skillName)) return 'tools';
        
        return 'tools'; // Default category
    }

    addNewSkill() {
        const name = document.getElementById('newSkillName').value.trim();
        const category = document.getElementById('newSkillCategory').value;
        const level = parseInt(document.getElementById('newSkillLevel').value);

        if (!name) {
            this.showMessage('Nama skill tidak boleh kosong!', 'error');
            return;
        }

        // Add to skills container
        const categoryContainer = document.querySelector(`.skill-category:nth-child(${this.getCategoryIndex(category)}) .skill-items`);
        if (categoryContainer) {
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <span class="skill-name">${name}</span>
                <input type="range" min="0" max="100" value="${level}" class="skill-slider" data-skill="${name}">
                <span class="skill-value">${level}%</span>
                <button class="btn btn-danger" onclick="this.parentElement.remove()">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            categoryContainer.appendChild(skillItem);

            // Add event listener to new slider
            const newSlider = skillItem.querySelector('.skill-slider');
            newSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueDisplay = e.target.parentElement.querySelector('.skill-value');
                valueDisplay.textContent = value + '%';
            });
        }

        // Clear form
        document.getElementById('newSkillName').value = '';
        document.getElementById('newSkillLevel').value = '50';
        document.getElementById('newSkillValue').textContent = '50%';

        this.saveToLocalStorage();
        this.showMessage(`Skill "${name}" berhasil ditambahkan!`, 'success');
    }

    getCategoryIndex(category) {
        const categories = ['frontend', 'backend', 'tools'];
        return categories.indexOf(category) + 1;
    }

    loadMessages() {
        // Load messages from localStorage
        const savedMessages = localStorage.getItem('portfolioMessages');
        this.messages = savedMessages ? JSON.parse(savedMessages) : [];

        // Add some sample messages if empty
        if (this.messages.length === 0) {
            this.messages = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    subject: 'Kolaborasi Proyek',
                    message: 'Halo! Saya tertarik untuk berkolaborasi dalam proyek web development. Apakah Anda tertarik?',
                    date: new Date().toISOString(),
                    read: false
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    subject: 'Pertanyaan tentang Portfolio',
                    message: 'Portfolio Anda sangat menarik! Boleh saya tanya tentang teknologi yang Anda gunakan?',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    read: true
                }
            ];
            this.saveMessages();
        }

        this.displayMessages();
        this.updateMessageCount();
    }

    displayMessages(filter = 'all') {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;

        let filteredMessages = this.messages;
        if (filter === 'unread') {
            filteredMessages = this.messages.filter(msg => !msg.read);
        } else if (filter === 'read') {
            filteredMessages = this.messages.filter(msg => msg.read);
        }

        messagesList.innerHTML = filteredMessages.map(message => `
            <div class="message-item ${!message.read ? 'unread' : ''}" onclick="adminPanel.openMessage(${message.id})">
                <div class="message-header">
                    <span class="message-sender">${message.name}</span>
                    <span class="message-date">${this.formatDate(message.date)}</span>
                </div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</div>
            </div>
        `).join('');
    }

    openMessage(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (!message) return;

        // Mark as read
        message.read = true;
        this.saveMessages();
        this.updateMessageCount();

        // Show message details in modal
        const messageDetails = document.getElementById('messageDetails');
        messageDetails.innerHTML = `
            <div class="message-detail">
                <div class="detail-row">
                    <strong>Dari:</strong> ${message.name} (${message.email})
                </div>
                <div class="detail-row">
                    <strong>Subjek:</strong> ${message.subject}
                </div>
                <div class="detail-row">
                    <strong>Tanggal:</strong> ${this.formatDate(message.date)}
                </div>
                <div class="detail-row">
                    <strong>Pesan:</strong>
                    <div class="message-content">${message.message}</div>
                </div>
            </div>
        `;

        // Store current message ID for deletion
        this.currentMessageId = messageId;

        // Show modal
        document.getElementById('messageModal').style.display = 'block';
    }

    closeMessageModal() {
        document.getElementById('messageModal').style.display = 'none';
    }

    deleteMessage() {
        if (this.currentMessageId) {
            this.messages = this.messages.filter(msg => msg.id !== this.currentMessageId);
            this.saveMessages();
            this.displayMessages();
            this.updateMessageCount();
            this.closeMessageModal();
            this.showMessage('Pesan berhasil dihapus!', 'success');
        }
    }

    deleteAllMessages() {
        if (confirm('Apakah Anda yakin ingin menghapus semua pesan?')) {
            this.messages = [];
            this.saveMessages();
            this.displayMessages();
            this.updateMessageCount();
            this.showMessage('Semua pesan berhasil dihapus!', 'success');
        }
    }

    filterMessages(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Find the clicked button and make it active
        const clickedButton = document.querySelector(`[onclick="filterMessages('${filter}')"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }

        this.displayMessages(filter);
    }

    saveMessages() {
        localStorage.setItem('portfolioMessages', JSON.stringify(this.messages));
    }

    updateMessageCount() {
        const unreadCount = this.messages.filter(msg => !msg.read).length;
        const messageCount = document.getElementById('messageCount');
        if (messageCount) {
            messageCount.textContent = unreadCount;
            messageCount.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
    }

    loadProjects() {
        // Load projects from localStorage
        const savedProjects = localStorage.getItem('portfolioProjects');
        this.projects = savedProjects ? JSON.parse(savedProjects) : [];

        // Add sample projects if empty
        if (this.projects.length === 0) {
            this.projects = [
                {
                    id: 1,
                    title: 'E-Commerce Platform',
                    description: 'Platform e-commerce modern dengan fitur pembayaran online, manajemen produk, dan dashboard admin.',
                    image: 'ecommerce.jpg',
                    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                    demo: 'https://demo-ecommerce.com',
                    code: 'https://github.com/yourusername/ecommerce'
                },
                {
                    id: 2,
                    title: 'Task Management App',
                    description: 'Aplikasi manajemen tugas dengan fitur drag & drop, notifikasi real-time, dan kolaborasi tim.',
                    image: 'taskapp.jpg',
                    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
                    demo: 'https://demo-taskapp.com',
                    code: 'https://github.com/yourusername/taskapp'
                }
            ];
            this.saveProjects();
        }

        this.displayProjects();
    }

    displayProjects() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        projectsList.innerHTML = this.projects.map(project => `
            <div class="project-item">
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                    <small>Teknologi: ${project.technologies.join(', ')}</small>
                </div>
                <div class="project-actions">
                    <button class="btn btn-secondary" onclick="adminPanel.editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="adminPanel.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }

    addNewProject() {
        this.currentProjectId = null;
        this.clearProjectForm();
        document.getElementById('projectModal').style.display = 'block';
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        this.currentProjectId = projectId;
        this.populateProjectForm(project);
        document.getElementById('projectModal').style.display = 'block';
    }

    populateProjectForm(project) {
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImage').value = project.image;
        document.getElementById('projectTechnologies').value = project.technologies.join(', ');
        document.getElementById('projectDemo').value = project.demo;
        document.getElementById('projectCode').value = project.code;
    }

    clearProjectForm() {
        document.getElementById('projectTitle').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectImage').value = '';
        document.getElementById('projectTechnologies').value = '';
        document.getElementById('projectDemo').value = '';
        document.getElementById('projectCode').value = '';
    }

    saveProject() {
        const projectData = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            image: document.getElementById('projectImage').value,
            technologies: document.getElementById('projectTechnologies').value.split(',').map(t => t.trim()),
            demo: document.getElementById('projectDemo').value,
            code: document.getElementById('projectCode').value
        };

        if (!projectData.title || !projectData.description) {
            this.showMessage('Judul dan deskripsi proyek wajib diisi!', 'error');
            return;
        }

        if (this.currentProjectId) {
            // Update existing project
            const index = this.projects.findIndex(p => p.id === this.currentProjectId);
            if (index !== -1) {
                this.projects[index] = { ...this.projects[index], ...projectData };
            }
        } else {
            // Add new project
            projectData.id = Date.now();
            this.projects.push(projectData);
        }

        this.saveProjects();
        this.displayProjects();
        this.closeModal();
        this.showMessage('Proyek berhasil disimpan!', 'success');
    }

    deleteProject(projectId) {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveProjects();
            this.displayProjects();
            this.showMessage('Proyek berhasil dihapus!', 'success');
        }
    }

    saveProjects() {
        localStorage.setItem('portfolioProjects', JSON.stringify(this.projects));
    }

    closeModal() {
        document.getElementById('projectModal').style.display = 'none';
    }

    updateAnalytics() {
        // Load analytics from localStorage
        const savedAnalytics = localStorage.getItem('portfolioAnalytics');
        this.analytics = savedAnalytics ? JSON.parse(savedAnalytics) : {
            totalViews: 1250,
            totalMessages: this.messages.length,
            avgTime: 180,
            totalClicks: 3400
        };

        // Update display
        document.getElementById('totalViews').textContent = this.analytics.totalViews.toLocaleString();
        document.getElementById('totalMessages').textContent = this.analytics.totalMessages;
        document.getElementById('avgTime').textContent = this.analytics.avgTime + 's';
        document.getElementById('totalClicks').textContent = this.analytics.totalClicks.toLocaleString();

        // Update charts
        this.updateCharts();
    }

    updateCharts() {
        // Simple chart for visits
        const visitsChart = document.getElementById('visitsChart');
        if (visitsChart) {
            // This would normally use Chart.js or similar
            visitsChart.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;">Chart akan ditampilkan di sini</div>';
        }

        // Top pages
        const topPages = document.getElementById('topPages');
        if (topPages) {
            topPages.innerHTML = `
                <div class="page-stat">
                    <span>Beranda</span>
                    <span>45%</span>
                </div>
                <div class="page-stat">
                    <span>Proyek</span>
                    <span>30%</span>
                </div>
                <div class="page-stat">
                    <span>Keahlian</span>
                    <span>15%</span>
                </div>
                <div class="page-stat">
                    <span>Kontak</span>
                    <span>10%</span>
                </div>
            `;
        }
    }

    saveAllChanges() {
        this.saveToLocalStorage();
        this.saveMessages();
        this.saveProjects();
        this.showMessage('Semua perubahan berhasil disimpan!', 'success');
    }

    exportData() {
        const data = {
            personal: {
                name: document.getElementById('name')?.value || '',
                title: document.getElementById('title')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                location: document.getElementById('location')?.value || '',
                description: document.getElementById('description')?.value || '',
                about: document.getElementById('about')?.value || ''
            },
            social: {
                linkedin: document.getElementById('linkedin')?.value || '',
                github: document.getElementById('github')?.value || '',
                instagram: document.getElementById('instagram')?.value || '',
                tiktok: document.getElementById('tiktok')?.value || ''
            },
            skills: this.getSkillsData(),
            projects: this.projects,
            messages: this.messages,
            analytics: this.analytics
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Data berhasil diexport!', 'success');
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${text}</span>
        `;

        // Add to page
        const content = document.querySelector('.admin-content');
        content.insertBefore(message, content.firstChild);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global functions for onclick handlers
function showSection(sectionId) {
    if (adminPanel) {
        adminPanel.showSection(sectionId);
    }
}

function addNewSkill() {
    if (adminPanel) {
        adminPanel.addNewSkill();
    }
}

function addNewProject() {
    if (adminPanel) {
        adminPanel.addNewProject();
    }
}

function editProject(projectId) {
    if (adminPanel) {
        adminPanel.editProject(projectId);
    }
}

function deleteProject(projectId) {
    if (adminPanel) {
        adminPanel.deleteProject(projectId);
    }
}

function saveProject() {
    if (adminPanel) {
        adminPanel.saveProject();
    }
}

function closeModal() {
    if (adminPanel) {
        adminPanel.closeModal();
    }
}

function openMessage(messageId) {
    if (adminPanel) {
        adminPanel.openMessage(messageId);
    }
}

function closeMessageModal() {
    if (adminPanel) {
        adminPanel.closeMessageModal();
    }
}

function deleteMessage() {
    if (adminPanel) {
        adminPanel.deleteMessage();
    }
}

function deleteAllMessages() {
    if (adminPanel) {
        adminPanel.deleteAllMessages();
    }
}

function filterMessages(filter) {
    if (adminPanel) {
        adminPanel.filterMessages(filter);
    }
}

function saveAllChanges() {
    if (adminPanel) {
        adminPanel.saveAllChanges();
    }
}

function exportData() {
    if (adminPanel) {
        adminPanel.exportData();
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    try {
        adminPanel = new AdminPanel();
        console.log('✅ Admin panel initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing admin panel:', error);
    }
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const projectModal = document.getElementById('projectModal');
    const messageModal = document.getElementById('messageModal');
    
    if (event.target === projectModal) {
        adminPanel.closeModal();
    }
    
    if (event.target === messageModal) {
        adminPanel.closeMessageModal();
    }
}); 