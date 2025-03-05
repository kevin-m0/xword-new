/** @type {import('next').NextConfig} */
import nextPWA from "@ducanh2912/next-pwa";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
                port: "",
                pathname: "/**",
                search: "",
            },
            {
                protocol: "https",
                hostname: "xword.s3.ap-south-1.amazonaws.com",
                port: "",
                pathname: "/**", // Allows all paths under this domain
                search: "",
            },
            {
                protocol: "https",
                hostname: "sample1.blr1.digitaloceanspaces.com",
                port: "",
                pathname: "/**", // Allows all paths under this domain
                search: "",
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
