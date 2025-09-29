
const BACKEND = process.env.BACKEND_URL ?? "http://127.0.0.1:8080";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.mujerhoy.com" },
      { protocol: "https", hostname: "**.amazon.com" },
      { protocol: "https", hostname: "**.m.media-amazon.com" },
      { protocol: "https", hostname: "**.ssl-images-amazon.com" },
      { protocol: "https", hostname: "**.casadellibro.com" },
    ],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND}/api/:path*` }];
  },
  output: "standalone",
};

export default nextConfig;
