import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
