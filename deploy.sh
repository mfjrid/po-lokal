#!/bin/bash

# PreOrderLokal Deployment Script
# Digunakan untuk update kode di VPS secara otomatis

echo "🚀 Melakukan update aplikasi..."

# 1. Ambil kode terbaru dari repository
git pull origin master

# 2. Install library jika ada perubahan dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Sinkronisasi database Prisma
echo "🗄️ Syncing database..."
npx prisma db push

# 4. Build aplikasi untuk production
echo "🏗️ Building application..."
npm run build

# 5. Restart PM2 agar status aplikasi terupdate
# Menjalankan di port 3006 (untuk menghindari konflik port 3005)
echo "♻️ Restarting PM2 process on port 3006..."
PORT=3006 pm2 restart po-lokal || PORT=3006 pm2 start npm --name "po-lokal" -- start

echo "✅ Deployment selesai! Aplikasi sudah berjalan dengan versi terbaru."
