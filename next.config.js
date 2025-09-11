/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

export default nextConfig
