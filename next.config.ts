import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
