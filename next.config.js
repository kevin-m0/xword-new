/** @type {import('next').NextConfig} */
import nextPWA from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',  // Allows any path under img.clerk.com
        search: '',
      },
    ],
  },
  experimental: {
      serverActions: {
        bodySizeLimit: '50mb',
      },
    },
};

export default nextConfig;
