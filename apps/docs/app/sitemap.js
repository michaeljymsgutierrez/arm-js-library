import { readdir } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'
const CONTENT_DIR = path.join(process.cwd(), 'content')

// Mirrors the routes under app/demo/** (see scripts/generate-api-reference.mjs
// for the API reference pages, which are walked from content/ directly below).
const DEMO_ROUTES = [
  '/collection-records/getter-setter-functions',
  '/collection-records/request-retrieve-functions/destroy-record',
  '/collection-records/request-retrieve-functions/get-collection',
  '/collection-records/request-retrieve-functions/reload',
  '/collection-records/request-retrieve-functions/rollback-attributes',
  '/collection-records/request-retrieve-functions/save',
  '/collection-records/state-properties',
  '/create-collection-record-function/create-record',
  '/push-collection-record-function/push-payload',
  '/remove-collection-records-functions/clear-collection',
  '/remove-collection-records-functions/unload-record',
  '/request-functions-from-server/find-all',
  '/request-functions-from-server/find-record',
  '/request-functions-from-server/passed-arguments',
  '/request-functions-from-server/query-record',
  '/request-functions-from-server/query',
  '/request-functions-from-server/returned-object',
  '/retrieve-functions-from-collections/get-alias',
  '/retrieve-functions-from-collections/get-request-alias',
  '/retrieve-functions-from-collections/get-collection',
  '/retrieve-functions-from-collections/peek-all',
  '/retrieve-functions-from-collections/peek-record',
]

/** Recursively collect every content/**\/*.mdx route, skipping _meta.js and dotfiles. */
const collectContentRoutes = async (dir, basePath = '') => {
  const entries = await readdir(dir, { withFileTypes: true })
  const routes = []

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      routes.push(...(await collectContentRoutes(entryPath, `${basePath}/${entry.name}`)))
      continue
    }

    if (!entry.name.endsWith('.mdx')) continue

    const slug = entry.name === 'index.mdx' ? '' : `/${entry.name.replace(/\.mdx$/, '')}`
    routes.push(`${basePath}${slug}` || '/')
  }

  return routes
}

export default async function sitemap() {
  const contentRoutes = await collectContentRoutes(CONTENT_DIR)
  const now = new Date()

  const docRoutes = contentRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }))

  const demoRoutes = DEMO_ROUTES.map((route) => ({
    url: `${SITE_URL}/demo${route}`,
    lastModified: now,
  }))

  return [...docRoutes, ...demoRoutes]
}
