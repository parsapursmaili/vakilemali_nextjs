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
  async redirects() {
    return [
      {
        source: "/مدارک-لازم-برای-انحصار-وراثت-و-مراحل-قا",
        destination: "/مراحل-و-مدارک-لازم-برای-انحصار-وراثت",
        permanent: true,
      },
      {
        source: "/articles/مراحل-شکایت-چک-برگشتی",
        destination: "/articles/صفر-تا-صد-شکایت-چک",
        permanent: true,
      },

      // هر تعداد که بخوای می‌تونی اینجا اضافه کنی...
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
