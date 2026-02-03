/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  output: "standalone",
  images: {
    unoptimized: true, // خیالت راحت، این یعنی نکست جی‌اس فقط آدرس را چاپ می‌کند و دخالتی نمی‌کند
    remotePatterns: [
      { protocol: "https", hostname: "**.vakilemali.ir" },
      { protocol: "https", hostname: "**.gravatar.com" },
    ],
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
    ];
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
