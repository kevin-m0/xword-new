/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'xword.s3.ap-south-1.amazonaws.com',
      //   port: '',
      //   pathname: '/**',
      //   search: '',
      // },
    ],
  },
  experimental: {
      serverActions: {
        bodySizeLimit: '50mb',
      },
    },
};

export default config;
