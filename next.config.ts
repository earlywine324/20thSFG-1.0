import type { NextConfig } from "next";
import path from "path";

// Extract hostname from Supabase URL for next/image remote patterns
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      // Specific project hostname when env var is available (preferred)
      ...(supabaseHostname
        ? [{ protocol: "https" as const, hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
        : []),
      // Wildcard fallback covering all Supabase-hosted projects
      { protocol: "https" as const, hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // Twitch stream thumbnails + profile images
      { protocol: "https" as const, hostname: "static-cdn.jtvnw.net" },
    ],
  },
};

export default nextConfig;
