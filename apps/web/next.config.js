/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Do NOT use output: 'export' — Firebase App Hosting requires
  // Next.js SSR mode (no static export). App Hosting handles the build.
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Proxy API calls from /api/* to the Cloud Run backend in production.
  // The NEXT_PUBLIC_API_URL env var is set in apphosting.yaml.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
