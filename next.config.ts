import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Standalone output for Docker deployment (docs/10_DEPLOYMENT_GUIDE.md). */
  output: "standalone",

  /** External packages for server-side only modules. */
  serverExternalPackages: ["@node-rs/argon2", "ioredis"],
};

export default nextConfig;
