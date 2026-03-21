/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '../../',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demo',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
