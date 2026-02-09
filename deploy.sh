#!/bin/bash
cd /home/app_runner/vakilemali

echo "Starting Deployment for VakileMali..."

# ۱. بیلد (بدون تغییر)
docker build -t vakilemali:latest .

# ۲. حذف کانتینر قدیمی
docker stop vakilemali 2>/dev/null || true
docker rm -f vakilemali 2>/dev/null || true

echo "Fixing public folder permissions with ACL..."
mkdir -p /home/app_runner/vakilemali/public
sudo chown -R 1000:1000 /home/app_runner/vakilemali/public
sudo chmod -R 755 /home/app_runner/vakilemali/public
# دادن دسترسی دائمی به یوزر شما روی این پوشه
sudo setfacl -R -m u:app_runner:rwx /home/app_runner/vakilemali/public
sudo setfacl -R -d -m u:app_runner:rwx /home/app_runner/vakilemali/public

# ۴. اجرا با متغیرهای محیطی ضروری برای رفع خطای 403
echo "Running container..."
docker run -d \
  --name vakilemali \
  --restart always \
  -p 3000:3000 \
  -v /home/app_runner/vakilemali/public:/app/public \
  -e NEXT_PUBLIC_SITE_URL="https://vakilemali.com" \
  -e NEXTAUTH_URL="https://vakilemali.com" \
  -e NODE_ENV="production" \
  vakilemali:latest

echo "Checking logs..."
sleep 5
docker logs --tail 30 vakilemali