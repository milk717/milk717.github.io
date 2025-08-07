// import { withContentlayer } from 'next-contentlayer';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'www.milk717.com',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'avatars.githubusercontent.com',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'milk717.imgur.com',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'i.imgur.com',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'image.yes24.com'
//             }
//         ],
//     },
// };

// export default withContentlayer(nextConfig);



const nextConfig = {
      images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.milk717.me',
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
            {
                protocol: 'https',
                hostname: 'image.yes24.com'
            }
        ],
    },
};

export default nextConfig;
