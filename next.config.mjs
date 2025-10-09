// next.config.js
import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {},
  },

  images: {
    // 🛑 این خطوط را حذف کنید 🛑
    // loader: "custom",
    // loaderFile: "./imageLoader.js",
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.vakilemali.ir" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
