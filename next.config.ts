import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: "warn",
  } as unknown as NextConfig["experimental"],
};

export default nextConfig;
