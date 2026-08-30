import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["bidserver.lol", "*.bidserver.lol", "*.vercel.app", "localhost:3000"],
    },
  },
};

export default nextConfig;
