/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    scrollRestoration: false,
  },
  images: {
    domains: ['res.cloudinary.com'], // Add all necessary external domains here
  },
};

export default nextConfig;
