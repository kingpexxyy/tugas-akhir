import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
