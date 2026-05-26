# مرحله اول: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./


# RUN npm install
RUN --mount=type=cache,target=/root/.npm \
    npm install

    
COPY . .
RUN npm run build

# مرحله دوم: Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# ساخت پوشه‌های مورد نیاز و تنظیم دسترسی برای یوزر node
RUN mkdir -p .next/cache public && chown -R node:node /app

# کپی فایل‌های تولید شده توسط نکس‌جی
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --chown=node:node .env* ./ 

USER node
EXPOSE 3000
ENV PORT=3000

# اجرای سرور نکس‌جی
CMD ["node", "server.js"]