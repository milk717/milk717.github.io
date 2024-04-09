/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.milk717.com',
            },
        ],
    },
};

export default nextConfig;
