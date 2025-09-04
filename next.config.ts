import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Skip ESLint during production builds (Docker)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
