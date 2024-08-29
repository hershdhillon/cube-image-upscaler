/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "replicate.com",
            },
            {
                protocol: "https",
                hostname: "replicate.delivery",
            },
        ],
    },
    env: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    },
};

export default nextConfig;