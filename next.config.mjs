/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
  output: "standalone",
  images: {
    unoptimized: true,
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
