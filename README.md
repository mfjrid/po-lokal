# PreOrderLokal 🚀

PreOrderLokal adalah platform marketplace mini yang dirancang khusus untuk membantu UMKM lokal mengelola sistem pre-order produk terbatas dengan mudah dan profesional. Aplikasi ini terintegrasi dengan gateway pembayaran **Mayar** untuk memastikan transaksi yang aman dan efisien.

## ✨ Fitur Utama
- **Marketplace Publik**: Pembeli bisa menjelajahi produk pre-order aktif dari berbagai UMKM.
- **Form Checkout Cepat**: Proses pemesanan yang simpel tanpa harus registrasi bagi pembeli.
- **Integrasi Mayar**: Pembayaran instan melalui Payment Link Mayar (Sandbox mode).
- **Dashboard Penjual**: Kelola produk, lihat statistik pendapatan, dan pantau pesanan masuk secara real-time.
- **Webhook Integration**: Update status pembayaran otomatis dari Mayar ke database aplikasi.

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, TypeScript.
- **Backend**: Next.js API Routes.
- **ORM**: Prisma with PostgreSQL.
- **Auth**: NextAuth.js (Credentials Provider).
- **Payment**: Mayar REST API.

## 🚀 Cara Menjalankan di Lokal

### 1. Persiapan Database
Pastikan Anda memiliki instance PostgreSQL (bisa menggunakan [Supabase](https://supabase.com) atau Docker).

### 2. Konfigurasi Environment
Buat file `.env` di root folder dan isi sesuai template:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="buat-secret-random-di-sini"

MAYAR_API_KEY="api_key_sandbox_anda"
MAYAR_BASE_URL="https://sandbox.mayar.id/hl/v1"
```

### 3. Install & Setup
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📦 Deployment ke Vercel
1. Push kode ke GitHub.
2. Hubungkan repository ke Vercel.
3. Masukkan semua variable di `.env` ke settings Environment Variables di Vercel.
4. Klik Deploy!

---
*Dibuat untuk Lomba Mayar - Solusi Digital UMKM Indonesia.*
