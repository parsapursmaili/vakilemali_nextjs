#!/bin/bash

# ۱. تغییر مسیر به پوشه جدید کاربر next
cd /home/next/vakilemali || exit

echo "Starting Secure Deployment for VakileMali..."

# ۲. بیلد کردن تصویر
docker build --network=host -t vakilemali:latest .

# ۳. مدیریت کانتینرهای قدیمی
docker stop vakilemali 2>/dev/null || true
docker rm -f vakilemali 2>/dev/null || true

# ۴. تنظیم دسترسی‌ها در خانه کاربر next (بدون دخالت روت)
echo "Fixing public folder permissions in /home/next..."
mkdir -p /home/next/vakilemali/public
# یوزر node داخل داکر (1000) و یوزر next بیرون داکر (1000) یکی هستند
chown -R 1000:1000 /home/next/vakilemali/public
chmod -R 755 /home/next/vakilemali/public

# ۵. اجرا با مسیر جدید (بسیار مهم: دیگر از مسیر /root استفاده نکن)
echo "Running container safely..."
docker run -d \
  --name vakilemali \
  --restart always \
  -p 3000:3000 \
  -v /home/next/vakilemali/public:/app/public \
  -e NEXT_PUBLIC_SITE_URL="https://vakilemali.com" \
  -e NEXTAUTH_URL="https://vakilemali.com" \
  -e NODE_ENV="production" \
  vakilemali:latest

echo "Deployment finished."