// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {}, // ✅ مقدار درست برای Next.js 15
  },

  images: {
    // 🚀 فعال کردن لودر سفارشی به عنوان پیش‌فرض سراسری
    loader: "custom",
    loaderFile: "./imageLoader.js",

    // فرمت خروجی بهینه
    formats: ["image/webp"],

    // دامنه‌های مجاز برای بارگذاری تصاویر
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vakilemali.ir",
      },
      {
        protocol: "https",
        hostname: "**.gravatar.com",
      },
    ],

    // کش ۳۰ روزه برای بهبود عملکرد
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
