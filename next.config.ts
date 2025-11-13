import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Optimizaciones para React 19
    reactCompiler: false,
  },
  // Optimizaciones de producción
  poweredByHeader: false,
  compress: true,
  // Para Supabase images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default nextConfig
