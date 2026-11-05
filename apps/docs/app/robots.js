const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
