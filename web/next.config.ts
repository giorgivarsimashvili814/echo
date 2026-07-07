import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'orbit-images-dev-giorgi.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
