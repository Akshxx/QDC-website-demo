/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // For static exports/Cloudflare deploy
  output: 'standalone',
  
  // Add PWA configuration and ensure assets are handled correctly
  images: {
    unoptimized: true, // For static exports
    domains: ['example.com'], // Add any external domains for images here
  },
  
  // Your existing configuration options...
};

module.exports = nextConfig;
