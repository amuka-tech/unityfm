/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "node-media-server"],
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
