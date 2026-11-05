import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
  ),
  title: {
    default: 'ARM JS Library',
    template: '%s - ARM JS Library',
  },
  description:
    'A lightweight, MobX-powered API resource manager for JavaScript - reactive collections, request deduplication, and JSON:API-friendly data normalization.',
  applicationName: 'ARM JS Library Docs',
  keywords: [
    'arm-js-library',
    'api resource manager',
    'mobx',
    'state management',
    'json:api',
    'javascript',
    'reactjs',
  ],
  authors: [{ name: 'Michael Jyms Gutierrez' }],
  openGraph: {
    type: 'website',
    siteName: 'ARM JS Library',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: './',
  },
}

const REPO_URL = 'https://github.com/michaeljymsgutierrez/arm-js-library'

// The official npm wordmark is built from thin rectangular bars, so even
// cropped to its own bounding box it reads as noticeably lighter/thinner
// than a solid-silhouette icon like GitHub's - a bold text badge matches
// the other icons' visual weight better than any monochrome npm glyph does.
const NpmIcon = () => (
  <span style={{ fontWeight: 700, fontSize: '1rem', lineHeight: '24px' }}>npm</span>
)

const navbar = (
  <Navbar
    logo={<b>ARM JS Library</b>}
    projectLink={REPO_URL}
    chatLink="https://www.npmjs.com/package/arm-js-library"
    chatIcon={<NpmIcon />}
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © Michael Jyms Gutierrez - ARM JS Library.
  </Footer>
)

export default async function DocsLayout({ children }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase={`${REPO_URL}/tree/main/apps/docs/content`}
          footer={footer}
          search={<Search />}
          editLink="Edit this page on GitHub">
          {children}
        </Layout>
      </body>
    </html>
  )
}
