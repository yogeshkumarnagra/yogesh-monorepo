import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for easy hosting on Vercel / GitHub Pages / Netlify
  output: "export",
  // Allow @yogesh/* packages to be transpiled
  transpilePackages: ["@yogesh/ui", "@yogesh/utils", "@yogesh/types"],
};

export default nextConfig;
