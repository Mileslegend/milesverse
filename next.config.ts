import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1️⃣ Whitelist your Gitpod (or Codespace/ngrok) URL
  allowedDevOrigins: [
    "https://3000-mileslegend-milesverse-a48pxt1fjb9.ws-eu118.gitpod.io",
  ],

  // 2️⃣ Use the new remotePatterns format instead of domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",        // leave empty if default 443
        pathname: "/**", // allow any path under img.clerk.com
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",        // leave empty
        pathname: "/**", // allow any path under cdn.sanity.io
      },
    ],
  },
};

export default nextConfig;
