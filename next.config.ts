import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/Aetrix-ai/web/raw/**",
      },
    ],
  },
};

export default nextConfig;
