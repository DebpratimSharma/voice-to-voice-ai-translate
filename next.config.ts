import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "microphone=(self)", // Change to microphone=(self) to allow
          },
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
