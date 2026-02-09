import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Matikan Turbopack secara total
  // @ts-ignore
  turbopack: {},
  
  // Solusi untuk WorkerError saat build PWA
  experimental: {
    webpackBuildWorker: true,
  },

  // Pengaturan tambahan untuk menstabilkan prerendering
  trailingSlash: true,
  reactStrictMode: false, // Matikan sementara untuk mempercepat build

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = withPWA(nextConfig);