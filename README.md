# TypeSpeed ⌨️⚡

TypeSpeed adalah sebuah web app uji kecepatan mengetik online berbasis HTML, JavaScript, dan Firebase. Aplikasi ini memungkinkan pengguna untuk mengukur kecepatan mengetik mereka secara real-time, menyimpan riwayat performa mereka, dan membandingkan skor dengan pengguna lain melalui leaderboard global.

## ✨ Fitur Utama

- 🧪 Uji kecepatan mengetik secara langsung
- 🔥 Leaderboard global menggunakan Firebase Realtime Database
- 🗂️ Riwayat kecepatan mengetik per user
- 🔐 Autentikasi user (Google Sign-In)
- 💾 Penyimpanan data user (kecepatan, akurasi, timestamp)
- 🌙 Tampilan minimalis dan responsif

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML + CSS + JavaScript
- **Backend:** Node.js (untuk integrasi dan fungsi tambahan jika dibutuhkan)
- **Database & Auth:** Firebase (Realtime Database + Authentication)


## 🚀 Cara Menjalankan Secara Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/Raihan285/TypeSpeed.git
   cd TypeSpeed

2. Install dependencies (jika menggunakan Cloud Functions):
    cd functions
    npm install

3. Jalankan Lokal menggunakan firebase CLI :
    firebase login
    firebase init
    firebase serve

📊 Fitur Leaderboard & Riwayat

• Setiap hasil mengetik disimpan di database berdasarkan UID user.

• Riwayat akan ditampilkan dalam profil pengguna.

• Leaderboard akan menampilkan skor tertinggi berdasarkan WPM dan akurasi.

📄 Lisensi
MIT License © 2025 Raihan Alif