import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* this is where config stuff goes. */
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default nextConfig;
