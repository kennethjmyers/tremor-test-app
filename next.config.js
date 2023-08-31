/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'av-cdn.bsky.app',
        port: '',
        pathname: '/img/avatar/**',
      },
    ],
  },
}

module.exports = nextConfig
