/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root to this folder (a stray lockfile exists higher up the tree).
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
