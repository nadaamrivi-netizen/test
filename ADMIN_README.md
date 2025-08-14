# Admin Panel - Portofolio Nada Cahya Amrivi

## 📋 Overview
Admin Panel adalah sistem manajemen konten untuk website portofolio yang memungkinkan Anda untuk:
- Update informasi pribadi secara real-time
- Kelola keahlian dan skill level
- Tambah/edit/hapus proyek
- Kelola pesan masuk dari pengunjung
- Lihat analytics website
- Export data portfolio

## 🚀 Cara Menggunakan

### 1. Akses Admin Panel
Buka file `admin-panel.html` di browser Anda untuk mengakses admin panel.

### 2. Fitur Utama

#### 📝 Informasi Pribadi
- **Nama Lengkap**: Update nama Anda
- **Judul/Profesi**: Update title yang ditampilkan
- **Email & Telepon**: Update informasi kontak
- **Lokasi**: Update lokasi Anda
- **Deskripsi**: Update deskripsi singkat
- **Tentang Saya**: Update deskripsi lengkap

#### 🛠️ Keahlian Teknis
- **Update Skill Level**: Gunakan slider untuk mengatur level keahlian (0-100%)
- **Tambah Skill Baru**: 
  - Masukkan nama skill
  - Pilih kategori (Frontend/Backend/Tools)
  - Atur level dengan slider
  - Klik "Tambah Skill"

#### 📁 Proyek
- **Lihat Proyek**: Daftar semua proyek portfolio
- **Tambah Proyek Baru**: 
  - Judul proyek
  - Deskripsi
  - URL gambar
  - Teknologi yang digunakan
  - Link demo dan code
- **Edit Proyek**: Klik tombol edit untuk mengubah detail proyek
- **Hapus Proyek**: Klik tombol hapus untuk menghapus proyek

#### 📱 Social Media
- **LinkedIn**: Update link LinkedIn
- **GitHub**: Update link GitHub
- **Instagram**: Update link Instagram
- **TikTok**: Update link TikTok

#### 📬 Pesan Masuk
- **Lihat Semua Pesan**: Daftar pesan dari pengunjung website
- **Filter Pesan**: 
  - Semua pesan
  - Belum dibaca
  - Sudah dibaca
- **Baca Pesan**: Klik pesan untuk melihat detail lengkap
- **Hapus Pesan**: Hapus pesan individual atau semua pesan
- **Mark as Read**: Pesan otomatis ditandai sudah dibaca saat dibuka

#### 📊 Analytics
- **Total Kunjungan**: Jumlah pengunjung website
- **Total Pesan**: Jumlah pesan yang diterima
- **Rata-rata Waktu Kunjungan**: Waktu rata-rata pengunjung di website
- **Total Klik**: Jumlah klik di website
- **Grafik Kunjungan**: Visualisasi kunjungan bulanan
- **Top Pages**: Halaman yang paling sering dikunjungi

## 💾 Penyimpanan Data

### Local Storage
Semua data disimpan di browser menggunakan localStorage:
- `portfolioData`: Data pribadi, social media, dan skills
- `portfolioMessages`: Pesan dari pengunjung
- `portfolioProjects`: Data proyek-proyek
- `portfolioAnalytics`: Data analytics

### Auto-Save
- Data otomatis tersimpan setiap kali ada perubahan
- Tidak perlu klik "Simpan" secara manual
- Data tetap aman meskipun browser ditutup

## 📤 Export Data

### Export Semua Data
Klik tombol "Export Data" untuk mengunduh file JSON berisi:
- Informasi pribadi
- Social media links
- Skills dan level
- Proyek-proyek
- Pesan masuk
- Analytics data

## 🔧 Integrasi dengan Website Utama

### Pesan Masuk
- Pesan dari form kontak di website utama otomatis masuk ke admin panel
- Sistem notifikasi real-time
- Badge counter untuk pesan belum dibaca

### Update Real-time
- Perubahan di admin panel langsung terlihat di website utama
- Refresh halaman website untuk melihat perubahan

## 🎨 Customization

### Styling
- File CSS: `admin-styles.css`
- Warna tema: Gradient biru-ungu (#667eea → #764ba2)
- Responsive design untuk mobile dan desktop

### JavaScript
- File utama: `admin-script.js`
- Class-based architecture
- Modular functions untuk setiap fitur

## 🔒 Keamanan

### Local Storage
- Data tersimpan di browser pengguna
- Tidak ada server backend yang diperlukan
- Data aman dan private

### Validasi Input
- Validasi form otomatis
- Pesan error yang informatif
- Sanitasi input untuk mencegah XSS

## 📱 Responsive Design

### Desktop
- Layout sidebar + content
- Grid layout untuk forms
- Hover effects dan animations

### Mobile
- Layout stack (sidebar di atas)
- Touch-friendly controls
- Optimized for small screens

## 🚀 Deployment

### Local Development
1. Buka `admin-panel.html` di browser
2. Semua fitur langsung berfungsi
3. Tidak perlu server atau setup tambahan

### Production
1. Upload semua file ke hosting
2. Akses `admin-panel.html` dari domain Anda
3. Data tersimpan di browser pengguna

## 📋 Checklist Setup

- [ ] Buka `admin-panel.html`
- [ ] Update informasi pribadi
- [ ] Atur skill levels
- [ ] Tambah proyek-proyek
- [ ] Update social media links
- [ ] Test form kontak di website utama
- [ ] Cek pesan masuk di admin panel
- [ ] Export data sebagai backup

## 🆘 Troubleshooting

### Data Tidak Tersimpan
- Pastikan browser mendukung localStorage
- Cek console untuk error JavaScript
- Refresh halaman dan coba lagi

### Pesan Tidak Muncul
- Pastikan `message-handler.js` ter-load
- Cek form kontak memiliki atribut `name`
- Test dengan mengirim pesan baru

### Admin Panel Tidak Responsive
- Pastikan `admin-styles.css` ter-load
- Cek viewport meta tag
- Test di browser berbeda

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Test di browser berbeda
4. Backup data sebelum melakukan perubahan besar

---

**Dibuat dengan ❤️ untuk Portofolio Nada Cahya Amrivi** 