/** @type {import('next').NextConfig} */
const nextConfig = {
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
