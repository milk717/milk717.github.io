/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.milk717.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'milk717.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            },
        ],
    },
};

export default nextConfig;
