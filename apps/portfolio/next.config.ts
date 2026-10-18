import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: removed static export to support API routes for the admin/editor feature
  transpilePackages: ["@yogesh/ui", "@yogesh/utils", "@yogesh/types"],
};

export default nextConfig;
