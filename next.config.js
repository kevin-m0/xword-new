/** @type {import('next').NextConfig} */
import nextPWA from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: [
            "img.clerk.com",
            "res.cloudinary.com",
            "images.unsplash.com",
            "sample1.blr1.digitaloceanspaces.com"
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "sample1.blr1.digitaloceanspaces.com",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
    },
};

export default config;
