import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Every page's frontmatter here is a flat `key: value` block (see
 * scripts/generate-api-reference.mjs and content/**\/*.mdx) - a tiny line
 * parser avoids pulling in a full YAML engine just for `title`/`description`.
 */
const parseFrontmatter = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const data = {}
  for (const line of match[1].split('\n')) {
    const lineMatch = line.match(/^(\w+):\s*"?(.*?)"?$/)
    if (lineMatch) data[lineMatch[1]] = lineMatch[2]
  }
  return data
}

/** Recursively collect every content/**\/*.mdx page's route + frontmatter title/description. */
const collectPages = async (dir, basePath = '') => {
  const entries = await readdir(dir, { withFileTypes: true })
  const pages = []

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      pages.push(...(await collectPages(entryPath, `${basePath}/${entry.name}`)))
      continue
    }

    if (!entry.name.endsWith('.mdx')) continue

    const slug = entry.name === 'index.mdx' ? '' : `/${entry.name.replace(/\.mdx$/, '')}`
    const route = `${basePath}${slug}` || '/'
    const data = parseFrontmatter(await readFile(entryPath, 'utf8'))

    pages.push({ route, title: data.title || route, description: data.description || '' })
  }

  return pages
}

/** Per the llms.txt convention (llmstxt.org): H1 + summary, then grouped markdown links. */
export async function GET() {
  const pages = await collectPages(CONTENT_DIR)
  const bySection = {
    Documentation: pages.filter((page) => page.route.startsWith('/docs') || page.route === '/docs'),
    'API Reference': pages.filter((page) => page.route.startsWith('/docs/api-reference')),
    Home: pages.filter((page) => page.route === '/'),
  }
  // API Reference is a subset of Documentation above - split it into its own section.
  bySection.Documentation = bySection.Documentation.filter(
    (page) => !page.route.startsWith('/docs/api-reference'),
  )

  const lines = [
    '# ARM JS Library',
    '',
    '> A lightweight, MobX-powered API resource manager for JavaScript - reactive collections, request deduplication, and JSON:API-friendly data normalization.',
    '',
    `Install: \`npm install arm-js-library --save\`. Source: https://github.com/michaeljymsgutierrez/arm-js-library`,
    '',
  ]

  for (const [section, sectionPages] of Object.entries(bySection)) {
    if (sectionPages.length === 0) continue
    lines.push(`## ${section}`, '')
    for (const page of sectionPages) {
      const descriptionSuffix = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${SITE_URL}${page.route})${descriptionSuffix}`)
    }
    lines.push('')
  }

  lines.push(
    '## Demo',
    '',
    `- [Live interactive demo](${SITE_URL}/demo): every method above running against a real API, in the browser.`,
    '',
  )

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
