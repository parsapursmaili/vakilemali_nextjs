// next.config.mjs
import customImageLoader from "./customImageLoader.js"; // 💡 اصلاح شد: واردات به صورت Default Import

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  images: {
    loader: "custom",
    loaderFile: "./customImageLoader.js",
    deviceSizes: [720],
    imageSizes: [720],
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
