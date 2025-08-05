<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'warkop_db');

// Create database connection
function getConnection() {
    try {
        $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $conn;
    } catch(PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}

// Initialize database tables
function initializeDatabase() {
    try {
        $conn = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database if not exists
        $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        $conn->exec($sql);
        
        // Connect to the database
        $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create tables
        createTables($conn);
        
        return true;
    } catch(PDOException $e) {
        die("Database initialization failed: " . $e->getMessage());
    }
}

// Create database tables
function createTables($conn) {
    // Users table (for admin)
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    
    // Menu categories table
    $sql = "CREATE TABLE IF NOT EXISTS menu_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    
    // Menu items table
    $sql = "CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_id INT,
        image VARCHAR(255),
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL
    )";
    $conn->exec($sql);
    
    // Gallery table
    $sql = "CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        image VARCHAR(255) NOT NULL,
        menu_item_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
    )";
    $conn->exec($sql);
    
    // Orders table
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_address TEXT NOT NULL,
        customer_notes TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
        payment_method ENUM('cash', 'transfer', 'online') DEFAULT 'cash',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    
    // Order items table
    $sql = "CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        notes TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    )";
    $conn->exec($sql);
    
    // Settings table
    $sql = "CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    
    // Insert default data
    insertDefaultData($conn);
}

// Insert default data
function insertDefaultData($conn) {
    // Insert default admin user
    $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $sql = "INSERT IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['admin', $adminPassword, 'admin@warkopnusantara.com', 'admin']);
    
    // Insert default categories
    $categories = [
        ['Kopi', 'Minuman kopi tradisional dan modern'],
        ['Makanan', 'Makanan berat dan ringan'],
        ['Minuman', 'Minuman non-kopi'],
        ['Snack', 'Cemilan dan makanan ringan']
    ];
    
    $sql = "INSERT IGNORE INTO menu_categories (name, description) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    foreach ($categories as $category) {
        $stmt->execute($category);
    }
    
    // Insert default menu items
    $menuItems = [
        ['Kopi Hitam', 'Kopi hitam tradisional dengan cita rasa yang kuat dan aromatik', 15000, 1, 'assets/images/kopi-hitam.jpg'],
        ['Kopi Susu', 'Kopi dengan campuran susu segar yang lembut dan creamy', 18000, 1, 'assets/images/kopi-susu.jpg'],
        ['Nasi Goreng', 'Nasi goreng spesial dengan telur, ayam, dan sayuran segar', 25000, 2, 'assets/images/nasi-goreng.jpg'],
        ['Mie Goreng', 'Mie goreng dengan bumbu special dan topping lengkap', 22000, 2, 'assets/images/mie-goreng.jpg'],
        ['Es Teh Manis', 'Teh manis dingin yang menyegarkan', 8000, 3, 'assets/images/es-teh.jpg'],
        ['Es Jeruk', 'Jeruk segar dengan es batu yang menyegarkan', 12000, 3, 'assets/images/es-jeruk.jpg'],
        ['Kopi Tubruk', 'Kopi tubruk tradisional dengan ampas kopi', 12000, 1, 'assets/images/kopi-tubruk.jpg'],
        ['Roti Bakar', 'Roti bakar dengan selai dan mentega', 15000, 4, 'assets/images/roti-bakar.jpg']
    ];
    
    $sql = "INSERT IGNORE INTO menu_items (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    foreach ($menuItems as $item) {
        $stmt->execute($item);
    }
    
    // Insert default settings
    $settings = [
        ['site_name', 'Warkop Nusantara', 'Nama website'],
        ['site_description', 'Kopi & Makanan Tradisional Terbaik', 'Deskripsi website'],
        ['contact_phone', '+62 21 1234 5678', 'Nomor telepon kontak'],
        ['contact_email', 'info@warkopnusantara.com', 'Email kontak'],
        ['contact_address', 'Jl. Sudirman No. 123, Jakarta Pusat', 'Alamat warkop'],
        ['opening_hours', 'Senin - Minggu: 06:00 - 22:00', 'Jam buka'],
        ['delivery_fee', '5000', 'Biaya pengiriman'],
        ['minimum_order', '25000', 'Minimum order untuk delivery']
    ];
    
    $sql = "INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    foreach ($settings as $setting) {
        $stmt->execute($setting);
    }
}

// Get setting value
function getSetting($key, $default = '') {
    try {
        $conn = getConnection();
        $sql = "SELECT setting_value FROM settings WHERE setting_key = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$key]);
        $result = $stmt->fetch();
        return $result ? $result['setting_value'] : $default;
    } catch(PDOException $e) {
        return $default;
    }
}

// Update setting value
function updateSetting($key, $value) {
    try {
        $conn = getConnection();
        $sql = "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP";
        $stmt = $conn->prepare($sql);
        return $stmt->execute([$key, $value, $value]);
    } catch(PDOException $e) {
        return false;
    }
}

// Generate order number
function generateOrderNumber() {
    $prefix = 'WK';
    $date = date('Ymd');
    $random = strtoupper(substr(md5(uniqid()), 0, 4));
    return $prefix . $date . $random;
}

// Initialize database on first run
if (!function_exists('isDatabaseInitialized')) {
    function isDatabaseInitialized() {
        try {
            $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
            $sql = "SELECT COUNT(*) FROM users";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchColumn() > 0;
        } catch(PDOException $e) {
            return false;
        }
    }
    
    // Auto-initialize if not already done
    if (!isDatabaseInitialized()) {
        initializeDatabase();
    }
}
?> 