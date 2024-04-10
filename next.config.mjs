/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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
