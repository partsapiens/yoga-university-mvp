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
    unoptimized: false, // Enable Next.js image optimization for better performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images - consider restricting in production
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern image formats for better compression
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['@tensorflow/tfjs', '@tensorflow-models/pose-detection'],
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
  async headers() {
    return [
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache headers for static assets
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Crawler-friendly headers for SEO files
      {
        source: '/(robots.txt|ads.txt|sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ]
  },
}

export default nextConfig
