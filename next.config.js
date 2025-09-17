/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Temporarily disable static export for API routes development
  // output: 'export',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  async redirects() {
    return [
      // Redirect legacy manual URLs to new React manual page
      {
        source: '/manual/index.html',
        destination: '/manual',
        permanent: true,
      },
      {
        source: '/manual/index',
        destination: '/manual',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
