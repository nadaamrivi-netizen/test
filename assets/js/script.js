// Global variables
let cart = [];
let currentMenu = null;
let menuData = [];
let galleryData = [];

// Menu and gallery data will be loaded from database via API
let menuData = [];
let galleryData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from API
    loadMenuFromAPI();
    loadGalleryFromAPI();
    generateQRCode();
    setupEventListeners();
    setupMobileMenu();
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterMenu(category);
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleOrderForm();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Modal close
    const modal = document.getElementById('menuModal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu setup
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load menu items from API
function loadMenuFromAPI() {
    fetch('api/menu.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                menuData = data.data;
                loadMenu();
            } else {
                console.error('Failed to load menu:', data.error);
                // Fallback to sample data if API fails
                loadSampleMenu();
            }
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            // Fallback to sample data if API fails
            loadSampleMenu();
        });
}

// Load menu items
function loadMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';
    
    menuData.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// Fallback sample menu data
function loadSampleMenu() {
    menuData = [
        {
            id: 1,
            name: "Kopi Hitam",
            description: "Kopi hitam tradisional dengan cita rasa yang kuat dan aromatik",
            price: 15000,
            category_name: "Kopi",
            image: "assets/images/kopi-hitam.jpg"
        },
        {
            id: 2,
            name: "Kopi Susu",
            description: "Kopi dengan campuran susu segar yang lembut dan creamy",
            price: 18000,
            category_name: "Kopi",
            image: "assets/images/kopi-susu.jpg"
        },
        {
            id: 3,
            name: "Nasi Goreng",
            description: "Nasi goreng spesial dengan telur, ayam, dan sayuran segar",
            price: 25000,
            category_name: "Makanan",
            image: "assets/images/nasi-goreng.jpg"
        }
    ];
    loadMenu();
}

// Create menu item element
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price">Rp ${item.price.toLocaleString()}</div>
        </div>
    `;

    menuItem.addEventListener('click', function() {
        openMenuModal(item);
    });

    return menuItem;
}

// Filter menu by category
function filterMenu(category) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';
    
    const filteredMenu = category === 'all' 
        ? menuData 
        : menuData.filter(item => item.category_name && item.category_name.toLowerCase() === category);
    
    filteredMenu.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// Load gallery items from API
function loadGalleryFromAPI() {
    // For now, we'll use menu items as gallery items
    // In a real implementation, you would have a separate gallery API
    fetch('api/menu.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                galleryData = data.data.map(item => ({
                    id: item.id,
                    title: item.name,
                    image: item.image,
                    menuId: item.id
                }));
                loadGallery();
            } else {
                console.error('Failed to load gallery:', data.error);
                loadSampleGallery();
            }
        })
        .catch(error => {
            console.error('Error loading gallery:', error);
            loadSampleGallery();
        });
}

// Load gallery items
function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';
    
    galleryData.forEach(item => {
        const galleryItem = createGalleryItem(item);
        galleryGrid.appendChild(galleryItem);
    });
}

// Fallback sample gallery data
function loadSampleGallery() {
    galleryData = [
        {
            id: 1,
            title: "Kopi Hitam",
            image: "assets/images/kopi-hitam.jpg",
            menuId: 1
        },
        {
            id: 2,
            title: "Kopi Susu",
            image: "assets/images/kopi-susu.jpg",
            menuId: 2
        },
        {
            id: 3,
            title: "Nasi Goreng",
            image: "assets/images/nasi-goreng.jpg",
            menuId: 3
        }
    ];
    loadGallery();
}

// Create gallery item element
function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}" onerror="this.src='assets/images/placeholder.jpg'">
        <div class="gallery-overlay">
            <h3>${item.title}</h3>
        </div>
    `;

    galleryItem.addEventListener('click', function() {
        // Find corresponding menu item and open modal
        const menuItem = menuData.find(menu => menu.id === item.menuId);
        if (menuItem) {
            openMenuModal(menuItem);
        }
    });

    return galleryItem;
}

// Open menu modal
function openMenuModal(item) {
    currentMenu = item;
    const modal = document.getElementById('menuModal');
    const modalImage = document.getElementById('modalMenuImage');
    const modalName = document.getElementById('modalMenuName');
    const modalDescription = document.getElementById('modalMenuDescription');
    const modalPrice = document.getElementById('modalMenuPrice');
    const modalQuantity = document.getElementById('menuQuantity');

    modalImage.src = item.image;
    modalImage.alt = item.name;
    modalName.textContent = item.name;
    modalDescription.textContent = item.description;
    modalPrice.textContent = `Rp ${item.price.toLocaleString()}`;
    modalQuantity.value = 1;

    modal.style.display = 'block';
}

// Quantity control functions
function increaseQuantity() {
    const quantityInput = document.getElementById('menuQuantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('menuQuantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add item to cart
function addToCart() {
    if (!currentMenu) return;

    const quantity = parseInt(document.getElementById('menuQuantity').value);
    const existingItem = cart.find(item => item.id === currentMenu.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...currentMenu,
            quantity: quantity
        });
    }

    updateCart();
    closeModal();
    showNotification('Item berhasil ditambahkan ke keranjang!');
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
        totalItems.textContent = '0';
        totalPrice.textContent = 'Rp 0';
        checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    let itemCount = 0;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">Rp ${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalItems.textContent = itemCount;
    totalPrice.textContent = `Rp ${total.toLocaleString()}`;
    checkoutBtn.disabled = false;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== itemId);
        }
        updateCart();
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('menuModal');
    modal.style.display = 'none';
    currentMenu = null;
}

// Handle order form submission
function handleOrderForm() {
    const formData = new FormData(document.getElementById('orderForm'));
    const customerData = {
        name: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        address: formData.get('customerAddress'),
        notes: formData.get('orderNotes')
    };

    // Store customer data in localStorage for checkout
    localStorage.setItem('customerData', JSON.stringify(customerData));
    
    // Scroll to cart section
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Data pelanggan berhasil disimpan!');
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'error');
        return;
    }

    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    if (!customerData.name || !customerData.phone || !customerData.address) {
        showNotification('Silakan lengkapi data pelanggan terlebih dahulu!', 'error');
        return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order data
    const orderData = {
        customer: customerData,
        items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            notes: ''
        })),
        payment_method: 'cash'
    };

    // Send order to server via API
    fetch('api/orders.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Pesanan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Clear form
            document.getElementById('orderForm').reset();
            localStorage.removeItem('customerData');
        } else {
            showNotification(data.error || 'Gagal mengirim pesanan!', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Terjadi kesalahan saat mengirim pesanan!', 'error');
    });
}

// Generate QR Code
function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;

    const websiteUrl = window.location.origin + window.location.pathname;
    
    QRCode.toCanvas(qrContainer, websiteUrl, {
        width: 200,
        margin: 2,
        color: {
            dark: '#8B4513',
            light: '#FFFFFF'
        }
    }, function(error) {
        if (error) {
            console.error('QR Code generation failed:', error);
            qrContainer.innerHTML = '<p>QR Code tidak dapat dibuat</p>';
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00C851' : '#8B4513'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
window.addEventListener('scroll', function() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        if (!scrollBtn) {
            const btn = document.createElement('button');
            btn.className = 'scroll-to-top';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            btn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #8B4513;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            `;
            btn.addEventListener('click', scrollToTop);
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });
            document.body.appendChild(btn);
        }
    } else {
        if (scrollBtn) {
            document.body.removeChild(scrollBtn);
        }
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.menu-item, .gallery-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}); 