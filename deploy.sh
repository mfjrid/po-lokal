#!/bin/bash

# PreOrderLokal Deployment Script (Docker Edition)
# Digunakan untuk update kode di VPS secara otomatis

echo "🚀 Melakukan update aplikasi..."

# 1. Ambil kode terbaru dari repository
git pull origin master

# 2. Build dan Jalankan Container Docker
echo "🐳 Building and starting Docker containers..."
docker compose down
docker compose up --build -d

# 3. Tunggu container ready (10 detik)
echo "⏳ Waiting for container to start..."
sleep 10

# 4. Jalankan Migrasi Prisma di dalam Container
echo "💾 Running Prisma migrations..."
docker compose exec -T app npx prisma db push

echo "✅ Deployment selesai! Aplikasi sudah berjalan di Docker (Port 3006)."
echo ""
echo "📋 Useful commands:"
echo "  docker ps                      - Lihat container yang berjalan"
echo "  docker logs -f po-lokal        - Lihat logs aplikasi"
echo "  docker compose restart         - Restart aplikasi"
