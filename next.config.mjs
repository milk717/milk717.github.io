import {withContentlayer} from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    swcMinify: true,
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

export default withContentlayer(nextConfig);
