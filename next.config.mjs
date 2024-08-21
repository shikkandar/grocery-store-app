/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'https://grocery-store-app-bakend.onrender.com',
                port: '1337',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
