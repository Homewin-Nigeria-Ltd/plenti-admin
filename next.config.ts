import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-select"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn.plenti",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "plenti-laravel.staging-api.motopayng.com",
      },
      {
        protocol: "https",
        hostname: "devmotopaymp.obs.af-south-1.myhuaweicloud.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "files.catbox.moe",
      },
    ],
  },
};

export default nextConfig;
