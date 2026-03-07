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
# Pastikan nama proses di PM2 adalah "po-lokal"
echo "♻️ Restarting PM2 process..."
pm2 restart po-lokal || pm2 start npm --name "po-lokal" -- start

echo "✅ Deployment selesai! Aplikasi sudah berjalan dengan versi terbaru."
