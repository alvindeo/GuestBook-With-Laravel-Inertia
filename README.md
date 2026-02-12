# Guestbook Project - Telkom Indonesia

Website Buku Tamu Digital yang dibangun dengan teknologi modern untuk memberikan pengalaman pengguna yang cepat dan fitur real-time.

## 🚀 Tech Stack
- **Backend:** Laravel 11
- **Frontend:** React.js (via Inertia.js)
- **Styling:** TailwindCSS
- **Real-time Engine:** Laravel Reverb (WebSocket)
- **Database:** MySQL

## 🛠️ Prasyarat (Requirements)
Pastikan komputer kamu sudah terinstall:
- [PHP >= 8.2](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [Node.js & NPM](https://nodejs.org/)
- [Laragon](https://laragon.org/) atau MySQL Server

## ⚙️ Langkah Instalasi

1. **Clone project atau buka di folder kerja kamu:**
   ```bash
   cd guestbook-telkom
   ```

2. **Install Dependensi PHP:**
   ```bash
   composer install
   ```

3. **Install Dependensi Frontend:**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment:**
   - Salin file `.env.example` menjadi `.env` (jika belum ada).
   - Pastikan pengaturan database di `.env` sudah sesuai:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=guestbook_telkom
     DB_USERNAME=root
     DB_PASSWORD=
     ```

5. **Generate APP Key:**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database:**
   ```bash
   php artisan migrate
   ```

7. **Jalankan Seeder (Untuk Akun Admin):**
   ```bash
   php artisan db:seed
   ```

## 🔑 Akun Default Admin
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

## 🏃 Cara Menjalankan Project
Untuk menjalankan fitur secara penuh (termasuk real-time), kamu perlu membuka **3 Terminal** sekaligus:

1. **Terminal 1 (Backend Server):**
   ```bash
   php artisan serve
   ```

2. **Terminal 2 (Frontend Compiler):**
   ```bash
   npm run dev
   ```

3. **Terminal 3 (Real-time WebSocket Server):**
   ```bash
   php artisan reverb:start
   ```

## 🌟 Fitur Utama
- **Real-time Dashboard:** Data tamu muncul otomatis tanpa refresh halaman.
- **Auto-fill Data:** Mendeteksi No HP untuk menampilkan data tamu lama secara otomatis.
- **Urgent Notification:** Notifikasi visual di admin jika tamu memasukkan keperluan penting (Komplain/Masalah).
- **Validasi Barcode:** Sistem pengiriman barcode ke email untuk validasi kehadiran tamu.
- **Export Data:** Laporan per periode dalam format Excel/PDF.
