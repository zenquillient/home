import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Mobile Network testing on 192.168.1.45
  allowedDevOrigins: ['192.168.1.45'],
};

export default nextConfig;
