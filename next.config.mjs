/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  staleTimes: {
      dynamic: 300,
      static: 1800,
    },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
