# 🌟 Website Portofolio Modern & Aesthetic

Website portofolio yang dibuat dengan desain modern, aesthetic, dan responsif dengan berbagai animasi dan transisi yang menarik.

## ✨ Fitur Utama

- 🎨 **Desain Modern & Aesthetic** - Gradient warna yang menarik dan layout yang clean
- 📱 **Responsif** - Optimal di semua perangkat (desktop, tablet, mobile)
- 🎭 **Animasi Smooth** - Transisi dan animasi yang halus dan menarik
- 🌊 **Parallax Effect** - Efek parallax pada hero section
- ✍️ **Typing Effect** - Animasi mengetik pada judul utama
- 📊 **Skill Bars Animation** - Animasi progress bar untuk skill
- 🎯 **Scroll Animations** - Animasi reveal saat scroll
- 🎪 **Floating Particles** - Efek partikel mengambang
- 🖱️ **Cursor Trail** - Efek trail cursor yang menarik
- 📧 **Contact Form** - Form kontak yang interaktif

## 🚀 Cara Menggunakan

### 1. Setup Awal
```bash
# Clone atau download file ini
# Buka folder di editor kode Anda
# Buka file index.html di browser
```

### 2. Kustomisasi Konten

#### Mengubah Informasi Pribadi
Edit file `index.html` dan ubah bagian-bagian berikut:

```html
<!-- Ganti "Nama Anda" dengan nama Anda -->
<h1 class="hero-title">
    Halo, Saya <span class="highlight">Nama Anda</span>
</h1>

<!-- Ganti deskripsi -->
<p class="hero-description">
    Saya adalah seorang developer yang passionate dalam menciptakan pengalaman digital yang menarik dan fungsional.
</p>

<!-- Ganti informasi kontak -->
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <div>
        <h4>Email</h4>
        <p>email@example.com</p> <!-- Ganti dengan email Anda -->
    </div>
</div>
```

#### Mengubah Skill
Edit bagian skill di `index.html`:

```html
<div class="skill-item">
    <span class="skill-name">HTML5</span>
    <div class="skill-bar">
        <div class="skill-progress" style="width: 95%"></div> <!-- Ganti persentase -->
    </div>
</div>
```

#### Mengubah Proyek
Edit bagian projects di `index.html`:

```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-shopping-cart"></i> <!-- Ganti icon -->
    </div>
    <div class="project-content">
        <h3>Nama Proyek Anda</h3> <!-- Ganti nama proyek -->
        <p>Deskripsi proyek Anda</p> <!-- Ganti deskripsi -->
        <div class="project-tech">
            <span class="tech-tag">React</span> <!-- Ganti teknologi -->
        </div>
        <div class="project-links">
            <a href="link-demo-anda" class="project-link">Demo</a> <!-- Ganti link -->
            <a href="link-github-anda" class="project-link">Code</a> <!-- Ganti link -->
        </div>
    </div>
</div>
```

### 3. Kustomisasi Warna

Edit file `styles.css` untuk mengubah skema warna:

```css
/* Warna utama - gradient */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Warna accent */
.highlight {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
}

/* Warna button */
.btn-primary {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
}
```

### 4. Menambahkan Foto Profil

1. Simpan foto Anda di folder yang sama dengan nama `profile.jpg`
2. Edit bagian profile image di `index.html`:

```html
<div class="profile-image">
    <img src="profile.jpg" alt="Foto Profil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
</div>
```

### 5. Menambahkan Gambar Proyek

1. Simpan gambar proyek di folder `images/`
2. Edit bagian project image:

```html
<div class="project-image">
    <img src="images/project1.jpg" alt="Proyek 1" style="width: 100%; height: 100%; object-fit: cover;">
</div>
```

## 🎨 Kustomisasi Lanjutan

### Mengubah Font
Edit di `index.html` bagian head:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Mengubah Animasi
Edit file `script.js` untuk mengubah kecepatan animasi:

```javascript
// Kecepatan typing effect
typeWriter(heroTitle, originalText, 50); // Ganti 50 dengan kecepatan yang diinginkan

// Kecepatan skill bars
setTimeout(() => {
    bar.style.width = width;
}, 500); // Ganti 500 dengan durasi yang diinginkan
```

### Menambahkan Section Baru
1. Tambahkan section di `index.html`
2. Tambahkan style di `styles.css`
3. Tambahkan animasi di `script.js`

## 📱 Responsivitas

Website sudah dioptimalkan untuk:
- 📱 Mobile (320px - 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (1024px+)

## 🌐 Deployment

### GitHub Pages
1. Upload file ke repository GitHub
2. Aktifkan GitHub Pages di settings
3. Website akan tersedia di `https://username.github.io/repository-name`

### Netlify
1. Drag & drop folder ke Netlify
2. Website akan otomatis ter-deploy

### Vercel
1. Connect repository ke Vercel
2. Deploy otomatis saat push ke main branch

## 🔧 Troubleshooting

### Animasi Tidak Berfungsi
- Pastikan JavaScript diaktifkan di browser
- Cek console untuk error
- Pastikan semua file ter-load dengan benar

### Gambar Tidak Muncul
- Periksa path file gambar
- Pastikan nama file sesuai (case sensitive)
- Cek permission file

### Responsivitas Bermasalah
- Pastikan viewport meta tag ada
- Cek CSS media queries
- Test di berbagai ukuran layar

## 📞 Support

Jika ada pertanyaan atau masalah, silakan:
- Buat issue di repository ini
- Hubungi melalui email yang tertera di website
- Cek dokumentasi di file ini

## 📄 License

Website ini dibuat untuk keperluan portofolio pribadi. Silakan modifikasi sesuai kebutuhan Anda.

---

**Dibuat dengan ❤️ dan ☕ untuk portofolio yang memukau!** 