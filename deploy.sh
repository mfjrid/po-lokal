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

# 4. Build dan Jalankan Container Docker
echo "🐳 Building and starting Docker containers..."
docker compose down
docker compose up --build -d

# 5. Jalankan Migrasi Prisma di dalam Container
echo "💾 Running Prisma migrations..."
docker compose exec -T app npx prisma db push

echo "✅ Deployment selesai! Aplikasi sudah berjalan di Docker (Port 3006)."
