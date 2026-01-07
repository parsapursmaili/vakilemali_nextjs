# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# استفاده از یوزر node (ID 1000)
RUN mkdir -p .next/cache public && chown -R node:node /app

# کپی فایل‌های Standalone
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --chown=node:node .env* ./ 

USER node
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]