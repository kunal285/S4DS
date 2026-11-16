/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["bcryptjs"],
  async redirects() {
    return [
      {
        source: "/technex",
        destination: "/technex-2k26",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
