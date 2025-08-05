<?php
/**
 * Warkop Nusantara - Installation Script
 * 
 * This script will help you set up the website automatically.
 * Run this file once to initialize the database and create necessary folders.
 */

// Check if already installed
if (file_exists('config/installed.txt')) {
    die('Website sudah terinstall. Hapus file config/installed.txt jika ingin menginstall ulang.');
}

// Start installation
echo "<!DOCTYPE html>
<html lang='id'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Instalasi Warkop Nusantara</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .step {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #8B4513;
            background: #f9f9f9;
        }
        .success { border-left-color: #27ae60; }
        .error { border-left-color: #e74c3c; }
        .warning { border-left-color: #f39c12; }
        .btn {
            background: #8B4513;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
        }
        .btn:hover { background: #A0522D; }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🚀 Instalasi Warkop Nusantara</h1>
        <p>Selamat datang di installer website Warkop Nusantara. Ikuti langkah-langkah di bawah ini untuk menyelesaikan instalasi.</p>";

// Step 1: Check PHP version
echo "<div class='step'>";
echo "<h3>Langkah 1: Pemeriksaan Sistem</h3>";

$phpVersion = phpversion();
$requiredVersion = '7.4.0';

if (version_compare($phpVersion, $requiredVersion, '>=')) {
    echo "<p class='success'>✅ PHP Version: $phpVersion (Memenuhi syarat)</p>";
} else {
    echo "<p class='error'>❌ PHP Version: $phpVersion (Minimal $requiredVersion)</p>";
    die("</div></div></body></html>");
}

// Check required extensions
$requiredExtensions = ['pdo', 'pdo_mysql', 'json'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p class='success'>✅ Extension $ext: Tersedia</p>";
    } else {
        echo "<p class='error'>❌ Extension $ext: Tidak tersedia</p>";
        die("</div></div></body></html>");
    }
}

// Check writable directories
$writableDirs = ['assets/images', 'config'];
foreach ($writableDirs as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "<p class='success'>✅ Directory $dir: Dibuat</p>";
        } else {
            echo "<p class='error'>❌ Directory $dir: Gagal dibuat</p>";
        }
    } else {
        if (is_writable($dir)) {
            echo "<p class='success'>✅ Directory $dir: Dapat ditulis</p>";
        } else {
            echo "<p class='warning'>⚠️ Directory $dir: Tidak dapat ditulis</p>";
        }
    }
}

echo "</div>";

// Step 2: Database Configuration
echo "<div class='step'>";
echo "<h3>Langkah 2: Konfigurasi Database</h3>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = $_POST['db_host'] ?? 'localhost';
    $dbUser = $_POST['db_user'] ?? 'root';
    $dbPass = $_POST['db_pass'] ?? '';
    $dbName = $_POST['db_name'] ?? 'warkop_db';
    
    // Test database connection
    try {
        $pdo = new PDO("mysql:host=$dbHost", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "<p class='success'>✅ Koneksi database berhasil</p>";
        
        // Create database if not exists
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "<p class='success'>✅ Database '$dbName' berhasil dibuat</p>";
        
        // Update config file
        $configContent = "<?php
// Database configuration
define('DB_HOST', '$dbHost');
define('DB_USER', '$dbUser');
define('DB_PASS', '$dbPass');
define('DB_NAME', '$dbName');

// Create database connection
function getConnection() {
    try {
        \$conn = new PDO(\"mysql:host=\" . DB_HOST . \";dbname=\" . DB_NAME, DB_USER, DB_PASS);
        \$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        \$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return \$conn;
    } catch(PDOException \$e) {
        die(\"Connection failed: \" . \$e->getMessage());
    }
}

// Initialize database tables
function initializeDatabase() {
    try {
        \$conn = new PDO(\"mysql:host=\" . DB_HOST, DB_USER, DB_PASS);
        \$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database if not exists
        \$sql = \"CREATE DATABASE IF NOT EXISTS \" . DB_NAME . \" CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci\";
        \$conn->exec(\$sql);
        
        // Connect to the database
        \$conn = new PDO(\"mysql:host=\" . DB_HOST . \";dbname=\" . DB_NAME, DB_USER, DB_PASS);
        \$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create tables
        createTables(\$conn);
        
        return true;
    } catch(PDOException \$e) {
        die(\"Database initialization failed: \" . \$e->getMessage());
    }
}

// Create database tables
function createTables(\$conn) {
    // Users table (for admin)
    \$sql = \"CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )\";
    \$conn->exec(\$sql);
    
    // Menu categories table
    \$sql = \"CREATE TABLE IF NOT EXISTS menu_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )\";
    \$conn->exec(\$sql);
    
    // Menu items table
    \$sql = \"CREATE TABLE IF NOT EXISTS menu_items (
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
    )\";
    \$conn->exec(\$sql);
    
    // Gallery table
    \$sql = \"CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        image VARCHAR(255) NOT NULL,
        menu_item_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
    )\";
    \$conn->exec(\$sql);
    
    // Orders table
    \$sql = \"CREATE TABLE IF NOT EXISTS orders (
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
    )\";
    \$conn->exec(\$sql);
    
    // Order items table
    \$sql = \"CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        notes TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    )\";
    \$conn->exec(\$sql);
    
    // Settings table
    \$sql = \"CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )\";
    \$conn->exec(\$sql);
    
    // Insert default data
    insertDefaultData(\$conn);
}

// Insert default data
function insertDefaultData(\$conn) {
    // Insert default admin user
    \$adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    \$sql = \"INSERT IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)\";
    \$stmt = \$conn->prepare(\$sql);
    \$stmt->execute(['admin', \$adminPassword, 'admin@warkopnusantara.com', 'admin']);
    
    // Insert default categories
    \$categories = [
        ['Kopi', 'Minuman kopi tradisional dan modern'],
        ['Makanan', 'Makanan berat dan ringan'],
        ['Minuman', 'Minuman non-kopi'],
        ['Snack', 'Cemilan dan makanan ringan']
    ];
    
    \$sql = \"INSERT IGNORE INTO menu_categories (name, description) VALUES (?, ?)\";
    \$stmt = \$conn->prepare(\$sql);
    foreach (\$categories as \$category) {
        \$stmt->execute(\$category);
    }
    
    // Insert default menu items
    \$menuItems = [
        ['Kopi Hitam', 'Kopi hitam tradisional dengan cita rasa yang kuat dan aromatik', 15000, 1, 'assets/images/kopi-hitam.jpg'],
        ['Kopi Susu', 'Kopi dengan campuran susu segar yang lembut dan creamy', 18000, 1, 'assets/images/kopi-susu.jpg'],
        ['Nasi Goreng', 'Nasi goreng spesial dengan telur, ayam, dan sayuran segar', 25000, 2, 'assets/images/nasi-goreng.jpg'],
        ['Mie Goreng', 'Mie goreng dengan bumbu special dan topping lengkap', 22000, 2, 'assets/images/mie-goreng.jpg'],
        ['Es Teh Manis', 'Teh manis dingin yang menyegarkan', 8000, 3, 'assets/images/es-teh.jpg'],
        ['Es Jeruk', 'Jeruk segar dengan es batu yang menyegarkan', 12000, 3, 'assets/images/es-jeruk.jpg'],
        ['Kopi Tubruk', 'Kopi tubruk tradisional dengan ampas kopi', 12000, 1, 'assets/images/kopi-tubruk.jpg'],
        ['Roti Bakar', 'Roti bakar dengan selai dan mentega', 15000, 4, 'assets/images/roti-bakar.jpg']
    ];
    
    \$sql = \"INSERT IGNORE INTO menu_items (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)\";
    \$stmt = \$conn->prepare(\$sql);
    foreach (\$menuItems as \$item) {
        \$stmt->execute(\$item);
    }
    
    // Insert default settings
    \$settings = [
        ['site_name', 'Warkop Nusantara', 'Nama website'],
        ['site_description', 'Kopi & Makanan Tradisional Terbaik', 'Deskripsi website'],
        ['contact_phone', '+62 21 1234 5678', 'Nomor telepon kontak'],
        ['contact_email', 'info@warkopnusantara.com', 'Email kontak'],
        ['contact_address', 'Jl. Sudirman No. 123, Jakarta Pusat', 'Alamat warkop'],
        ['opening_hours', 'Senin - Minggu: 06:00 - 22:00', 'Jam buka'],
        ['delivery_fee', '5000', 'Biaya pengiriman'],
        ['minimum_order', '25000', 'Minimum order untuk delivery']
    ];
    
    \$sql = \"INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)\";
    \$stmt = \$conn->prepare(\$sql);
    foreach (\$settings as \$setting) {
        \$stmt->execute(\$setting);
    }
}

// Get setting value
function getSetting(\$key, \$default = '') {
    try {
        \$conn = getConnection();
        \$sql = \"SELECT setting_value FROM settings WHERE setting_key = ?\";
        \$stmt = \$conn->prepare(\$sql);
        \$stmt->execute([\$key]);
        \$result = \$stmt->fetch();
        return \$result ? \$result['setting_value'] : \$default;
    } catch(PDOException \$e) {
        return \$default;
    }
}

// Update setting value
function updateSetting(\$key, \$value) {
    try {
        \$conn = getConnection();
        \$sql = \"INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP\";
        \$stmt = \$conn->prepare(\$sql);
        return \$stmt->execute([\$key, \$value, \$value]);
    } catch(PDOException \$e) {
        return false;
    }
}

// Generate order number
function generateOrderNumber() {
    \$prefix = 'WK';
    \$date = date('Ymd');
    \$random = strtoupper(substr(md5(uniqid()), 0, 4));
    return \$prefix . \$date . \$random;
}

// Initialize database on first run
if (!function_exists('isDatabaseInitialized')) {
    function isDatabaseInitialized() {
        try {
            \$conn = new PDO(\"mysql:host=\" . DB_HOST . \";dbname=\" . DB_NAME, DB_USER, DB_PASS);
            \$sql = \"SELECT COUNT(*) FROM users\";
            \$stmt = \$conn->prepare(\$sql);
            \$stmt->execute();
            return \$stmt->fetchColumn() > 0;
        } catch(PDOException \$e) {
            return false;
        }
    }
    
    // Auto-initialize if not already done
    if (!isDatabaseInitialized()) {
        initializeDatabase();
    }
}
?>";

        if (file_put_contents('config/database.php', $configContent)) {
            echo "<p class='success'>✅ File konfigurasi database berhasil dibuat</p>";
        } else {
            echo "<p class='error'>❌ Gagal membuat file konfigurasi database</p>";
            die("</div></div></body></html>");
        }
        
        // Initialize database
        require_once 'config/database.php';
        if (initializeDatabase()) {
            echo "<p class='success'>✅ Database berhasil diinisialisasi</p>";
        } else {
            echo "<p class='error'>❌ Gagal menginisialisasi database</p>";
            die("</div></div></body></html>");
        }
        
        // Create installed flag
        file_put_contents('config/installed.txt', date('Y-m-d H:i:s'));
        
        echo "<div class='step success'>";
        echo "<h3>🎉 Instalasi Berhasil!</h3>";
        echo "<p>Website Warkop Nusantara berhasil diinstall. Berikut adalah informasi penting:</p>";
        echo "<ul>";
        echo "<li><strong>Website:</strong> <a href='index.html' target='_blank'>Buka Website</a></li>";
        echo "<li><strong>Admin Panel:</strong> <a href='admin/' target='_blank'>Buka Admin Panel</a></li>";
        echo "<li><strong>Username Admin:</strong> admin</li>";
        echo "<li><strong>Password Admin:</strong> admin123</li>";
        echo "</ul>";
        echo "<p><strong>Penting:</strong> Ganti password admin segera setelah login pertama kali!</p>";
        echo "<a href='index.html' class='btn'>Buka Website</a>";
        echo "<a href='admin/' class='btn'>Buka Admin Panel</a>";
        echo "</div>";
        
    } catch (PDOException $e) {
        echo "<p class='error'>❌ Koneksi database gagal: " . $e->getMessage() . "</p>";
        echo "<p>Pastikan informasi database yang Anda masukkan benar.</p>";
    }
} else {
    echo "<form method='POST'>
        <div class='form-group'>
            <label>Host Database:</label>
            <input type='text' name='db_host' value='localhost' required>
        </div>
        <div class='form-group'>
            <label>Username Database:</label>
            <input type='text' name='db_user' value='root' required>
        </div>
        <div class='form-group'>
            <label>Password Database:</label>
            <input type='password' name='db_pass' value=''>
        </div>
        <div class='form-group'>
            <label>Nama Database:</label>
            <input type='text' name='db_name' value='warkop_db' required>
        </div>
        <button type='submit' class='btn'>Lanjutkan Instalasi</button>
    </form>";
}

echo "</div>";

echo "</div></body></html>";
?> 