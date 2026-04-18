/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // swcMinify: true, // Enable SWC minification for faster builds (default in Next.js 13+)
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
