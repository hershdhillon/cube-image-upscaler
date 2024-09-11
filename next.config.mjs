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
        domains: ['localhost', 'replicate.com', 'replicate.delivery'],
        unoptimized: true,
    },
    env: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    },
};

export default nextConfig;