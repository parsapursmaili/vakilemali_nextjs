FROM node:20-alpine

WORKDIR /app

# نصب پکیج‌ها (این بخش کش میشه و سرعت میره بالا)
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# پورت نسخه تست
EXPOSE 3020
ENV PORT=3020
ENV NODE_ENV=development

# اجرای مستقیم در حالت توسعه
CMD ["npm", "run", "dev"]
