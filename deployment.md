# 🚀 Deployment Guide - Portfolio Website

Panduan lengkap untuk mendeploy website portofolio Anda ke berbagai platform hosting.

## 📋 Prerequisites

Sebelum deployment, pastikan Anda telah:

- ✅ Mengkustomisasi konten di `config.js`
- ✅ Mengganti informasi pribadi di `index.html`
- ✅ Menambahkan gambar dan aset yang diperlukan
- ✅ Menguji website secara lokal

## 🌐 Platform Deployment

### 1. GitHub Pages (Gratis)

**Langkah-langkah:**

1. **Buat Repository GitHub**
   ```bash
   # Buat repository baru di GitHub
   # Nama: username.github.io (untuk custom domain)
   # Atau: portfolio-website (untuk subdirectory)
   ```

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio website"
   git branch -M main
   git remote add origin https://github.com/username/repository-name.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages**
   - Buka repository di GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Save

4. **Custom Domain (Opsional)**
   - Settings → Pages → Custom domain
   - Masukkan domain Anda
   - Tambahkan CNAME file di repository

**URL:** `https://username.github.io/repository-name`

### 2. Netlify (Gratis)

**Langkah-langkah:**

1. **Drag & Drop**
   - Buka [netlify.com](https://netlify.com)
   - Drag folder website ke area deploy
   - Website akan otomatis ter-deploy

2. **Git Integration**
   - Connect repository GitHub
   - Auto-deploy saat push ke main branch

3. **Custom Domain**
   - Domain management di Netlify dashboard
   - SSL otomatis

**URL:** `https://random-name.netlify.app`

### 3. Vercel (Gratis)

**Langkah-langkah:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   # Follow prompts
   ```

3. **Git Integration**
   - Connect repository di Vercel dashboard
   - Auto-deploy saat push

**URL:** `https://project-name.vercel.app`

### 4. Firebase Hosting (Gratis)

**Langkah-langkah:**

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login & Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

**URL:** `https://project-id.web.app`

## 🔧 Build Optimization

### 1. Minification

**CSS Minification:**
```bash
# Install CSS minifier
npm install -g clean-css-cli

# Minify CSS
cleancss -o styles.min.css styles.css
```

**JavaScript Minification:**
```bash
# Install JS minifier
npm install -g uglify-js

# Minify JS files
uglifyjs script.js -o script.min.js
uglifyjs dark-mode.js -o dark-mode.min.js
# ... repeat for all JS files
```

### 2. Image Optimization

**Tools:**
- [TinyPNG](https://tinypng.com) - Online compression
- [ImageOptim](https://imageoptim.com) - Desktop app
- [Squoosh](https://squoosh.app) - Google's tool

**WebP Conversion:**
```bash
# Install cwebp
cwebp -q 80 image.jpg -o image.webp
```

### 3. Gzip Compression

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 📱 PWA Deployment

### 1. Service Worker

Pastikan `sw.js` sudah terkonfigurasi dengan benar:

```javascript
// Update cache version saat deploy
const CACHE_NAME = 'portfolio-v1.1.0';
```

### 2. Manifest File

Periksa `site.webmanifest`:
```json
{
  "name": "Your Portfolio",
  "short_name": "Portfolio",
  "start_url": "/",
  "display": "standalone"
}
```

### 3. HTTPS Requirement

PWA memerlukan HTTPS. Pastikan hosting Anda mendukung SSL.

## 🔍 SEO Optimization

### 1. Meta Tags

Update meta tags di `index.html`:
```html
<meta name="description" content="Your portfolio description">
<meta name="keywords" content="web developer, portfolio, your skills">
<meta property="og:title" content="Your Portfolio">
<meta property="og:description" content="Your portfolio description">
```

### 2. Sitemap

Update `sitemap.xml` dengan URL yang benar:
```xml
<url>
  <loc>https://yourdomain.com/</loc>
  <lastmod>2024-01-01</lastmod>
</url>
```

### 3. Robots.txt

Update `robots.txt`:
```txt
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## 🚀 Performance Optimization

### 1. Preload Critical Resources

```html
<link rel="preload" href="styles.css" as="style">
<link rel="preload" href="script.js" as="script">
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" as="style">
```

### 2. Lazy Loading

```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### 3. CDN Integration

Gunakan CDN untuk aset eksternal:
```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
```

## 🔒 Security Headers

### 1. Content Security Policy

Tambahkan di server atau `.htaccess`:
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
```

### 2. Security Headers

```apache
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

## 📊 Analytics Setup

### 1. Google Analytics

Tambahkan di `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Google Search Console

1. Verifikasi ownership domain
2. Submit sitemap
3. Monitor performance

## 🔄 Continuous Deployment

### 1. GitHub Actions

Buat `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 2. Automated Testing

```yaml
name: Test and Deploy
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run tests
      run: |
        # Add your test commands here
        echo "Running tests..."
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Deploy
      # Deploy steps
```

## 🐛 Troubleshooting

### Common Issues:

1. **404 Errors**
   - Periksa file paths
   - Pastikan semua file ter-upload

2. **CORS Errors**
   - Periksa CSP headers
   - Pastikan domain diizinkan

3. **Performance Issues**
   - Optimize images
   - Minify CSS/JS
   - Enable compression

4. **PWA Not Working**
   - Periksa HTTPS
   - Validasi manifest
   - Test service worker

## 📈 Post-Deployment Checklist

- [ ] Website loading dengan cepat
- [ ] Responsive di semua device
- [ ] PWA dapat diinstall
- [ ] SEO meta tags terpasang
- [ ] Analytics berfungsi
- [ ] SSL certificate aktif
- [ ] Custom domain terkonfigurasi
- [ ] Backup files tersimpan
- [ ] Monitoring setup

## 🎯 Performance Targets

- **Page Load Time:** < 3 detik
- **First Contentful Paint:** < 1.5 detik
- **Largest Contentful Paint:** < 2.5 detik
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

## 📞 Support

Jika mengalami masalah deployment:

1. Periksa error logs
2. Test di browser developer tools
3. Verifikasi file permissions
4. Hubungi hosting provider support

---

**Selamat! Website portofolio Anda sudah siap untuk dunia! 🌟** 