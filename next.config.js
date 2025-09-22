/** @type {import('next').NextConfig} */
const nextConfig = {
  // DO NOT expose OPENAI_API_KEY to client-side code
  // OpenAI calls should only happen server-side via API routes
  env: {
    // Add other non-secret environment variables here if needed
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Improve performance for static images
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
