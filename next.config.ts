import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    // Prevent "Module not found: Can't resolve 'canvas'" error
    config.resolve.alias.canvas = false;
    
    // Required for PDF generation
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
    };
    
    return config;
  },
};

export default nextConfig;
