import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Mobile Network testing on 192.168.1.45
  allowedDevOrigins: ['192.168.1.45'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tor.cloud.appwrite.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
