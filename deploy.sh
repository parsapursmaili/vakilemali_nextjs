#!/bin/bash
cd /home/app_runner/vakilemali

# ۱. بیلد
echo "Building new Docker image..."
docker build --no-cache -t vakilemali:latest .

# ۲. حذف کانتینر قبلی
echo "Replacing container..."
docker stop vakilemali 2>/dev/null || true
docker rm -f vakilemali 2>/dev/null || true

# ۳. اصلاح دسترسی پوشه ذخیره‌سازی دائمی
echo "Fixing permissions for storage..."
mkdir -p /home/app_runner/vakilemali/storage
sudo chown -R 1000:1000 /home/app_runner/vakilemali/storage

# ۴. اجرا (بدون مپ کردن کش - برای ثبات ۱۰۰ درصد)
echo "Starting new container..."
docker run -d \
  --name vakilemali \
  --restart always \
  -p 3000:3000 \
  -v /home/app_runner/vakilemali/storage:/app/storage \
  vakilemali:latest

echo "Deployment finished successfully."
docker ps | grep vakilemali