# Struktur Proyek Website Warkop Nusantara

Berikut adalah struktur lengkap file dan folder dalam proyek website warkop:

```
warkop-website/
├── 📁 assets/                          # Folder aset frontend
│   ├── 📁 css/
│   │   └── 📄 style.css               # CSS utama website (aesthetic & responsive)
│   ├── 📁 js/
│   │   └── 📄 script.js               # JavaScript frontend (interaktivitas)
│   └── 📁 images/                     # Folder gambar
│       └── 📄 placeholder.jpg         # Placeholder untuk gambar
│
├── 📁 admin/                          # Admin Panel
│   ├── 📄 index.php                   # Dashboard admin
│   ├── 📄 login.php                   # Halaman login admin
│   ├── 📄 logout.php                  # Logout admin
│   ├── 📄 orders.php                  # Manajemen pesanan
│   └── 📁 assets/
│       ├── 📁 css/
│       │   └── 📄 admin.css           # CSS admin panel
│       └── 📁 js/
│           └── 📄 admin.js            # JavaScript admin panel
│
├── 📁 api/                            # API Endpoints
│   ├── 📄 menu.php                    # API untuk manajemen menu
│   └── 📄 orders.php                  # API untuk manajemen pesanan
│
├── 📁 config/                         # Konfigurasi sistem
│   └── 📄 database.php                # Konfigurasi database
│
├── 📄 index.html                      # Halaman utama website
├── 📄 install.php                     # Script instalasi otomatis
├── 📄 .htaccess                       # Konfigurasi server Apache
├── 📄 README.md                       # Dokumentasi lengkap
├── 📄 STRUCTURE.md                    # Dokumentasi struktur (file ini)
└── 📄 config/installed.txt            # Flag instalasi (dibuat otomatis)
```

## 📋 Deskripsi File Utama

### 🎨 Frontend Files
- **`index.html`** - Halaman utama website dengan desain modern dan aesthetic
- **`assets/css/style.css`** - Styling lengkap dengan responsive design
- **`assets/js/script.js`** - Interaktivitas website (menu, cart, QR code)

### 🔧 Backend Files
- **`config/database.php`** - Konfigurasi database dan fungsi-fungsi utama
- **`api/menu.php`** - API untuk CRUD operasi menu
- **`api/orders.php`** - API untuk manajemen pesanan

### 👨‍💼 Admin Panel
- **`admin/index.php`** - Dashboard admin dengan statistik
- **`admin/login.php`** - Sistem login admin yang aman
- **`admin/orders.php`** - Manajemen pesanan dengan detail lengkap
- **`admin/assets/css/admin.css`** - Styling admin panel
- **`admin/assets/js/admin.js`** - JavaScript admin panel

### 🚀 Installation & Configuration
- **`install.php`** - Script instalasi otomatis dengan GUI
- **`.htaccess`** - Konfigurasi server untuk keamanan dan performance
- **`README.md`** - Dokumentasi lengkap penggunaan

## 🎯 Fitur Utama

### ✅ Frontend Features
- **Menu yang bisa diubah sendiri** - Admin dapat mengelola menu
- **Galeri foto menu** - Tampilan foto dengan hover effects
- **Form pemesanan online** - Sistem pemesanan user-friendly
- **Keranjang belanja** - Cart dengan perhitungan total otomatis
- **QR Code untuk pengunjung** - QR code yang mengarah ke website
- **Desain responsive** - Optimal di semua device
- **Animasi dan transisi** - Efek visual yang smooth

### ✅ Admin Panel Features
- **Dashboard dengan statistik** - Overview pesanan dan pendapatan
- **Manajemen menu** - CRUD operasi untuk menu dan kategori
- **Manajemen pesanan** - Tracking status pesanan real-time
- **Manajemen galeri** - Upload dan kelola foto menu
- **Pengaturan website** - Konfigurasi informasi warkop
- **Sistem login yang aman** - Password hashing dan session management

### ✅ Backend Features
- **Database MySQL** - Struktur database yang terorganisir
- **API RESTful** - Endpoint untuk menu dan pesanan
- **Sistem autentikasi** - Login admin yang aman
- **File upload** - Upload gambar untuk menu dan galeri
- **Validasi data** - Validasi input yang robust

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Libraries**: 
  - Font Awesome (Icons)
  - Google Fonts (Poppins)
  - QRCode.js (QR Code generation)

## 🚀 Cara Instalasi

1. **Upload semua file** ke web server
2. **Jalankan `install.php`** di browser
3. **Ikuti langkah-langkah** instalasi
4. **Login admin** dengan username: `admin`, password: `admin123`

## 🔒 Keamanan

- Password hashing dengan `password_hash()`
- SQL injection protection dengan prepared statements
- XSS protection dengan `htmlspecialchars()`
- CSRF protection dengan session management
- Input validation yang robust
- File access protection dengan `.htaccess`

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎨 Color Scheme

- **Primary**: #8B4513 (Saddle Brown)
- **Secondary**: #A0522D (Sienna)
- **Background**: #f5f5f5 (Light Gray)
- **Text**: #333333 (Dark Gray)

## 📊 Database Structure

### Tabel Utama
- `users` - Data pengguna admin
- `menu_categories` - Kategori menu
- `menu_items` - Item menu
- `gallery` - Foto galeri
- `orders` - Data pesanan
- `order_items` - Item dalam pesanan
- `settings` - Pengaturan website

## 🔄 API Endpoints

### Menu API (`/api/menu.php`)
- `GET` - Ambil semua menu atau menu berdasarkan kategori
- `POST` - Tambah menu baru
- `PUT` - Update menu
- `DELETE` - Hapus menu (soft delete)

### Orders API (`/api/orders.php`)
- `GET` - Ambil semua pesanan atau pesanan berdasarkan status
- `POST` - Buat pesanan baru
- `PUT` - Update status pesanan
- `DELETE` - Hapus pesanan

## 📈 Performance Features

- **Image optimization** - Gambar yang dioptimasi
- **CSS/JS minification** - File yang dikompresi
- **Lazy loading** - Loading gambar yang efisien
- **Caching** - Cache untuk static files
- **CDN compatible** - Siap untuk CDN

## 🔧 Maintenance

### Regular Tasks
- Backup database secara berkala
- Update gambar menu
- Monitor log error
- Update informasi kontak
- Review dan update menu

### Backup Commands
```bash
# Backup database
mysqldump -u username -p warkop_db > backup.sql

# Backup files
tar -czf warkop-backup.tar.gz /path/to/warkop-website/
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection Error** - Periksa konfigurasi database
2. **Image Upload Failed** - Periksa folder permissions
3. **Admin Login Failed** - Reset password di database

## 📞 Support

Untuk bantuan dan dukungan:
- Email: support@warkopnusantara.com
- Phone: +62 21 1234 5678
- Website: www.warkopnusantara.com

---

**© 2024 Warkop Nusantara. All rights reserved.** 