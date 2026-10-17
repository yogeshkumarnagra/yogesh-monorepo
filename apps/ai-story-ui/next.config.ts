import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow @yogesh/* packages to be transpiled (needed for monorepo)
  transpilePackages: ["@yogesh/ui", "@yogesh/utils", "@yogesh/types"],
};

export default nextConfig;
