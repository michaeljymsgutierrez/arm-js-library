#!/usr/bin/env node
/**
 * Generates the public API reference pages for content/docs/api-reference/
 * from the JSDoc comments on ApiResourceManager.
 *
 * Reuses jsdoc-to-markdown (same tool as packages/package.json's build:jsdocs)
 * against the raw JSDoc data rather than its rendered markdown, so each public
 * method gets its own page and private/internal methods (prefixed with `_`)
 * never reach the public reference.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import jsdoc2md from 'jsdoc-to-markdown'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_FILE = path.join(
  __dirname,
  '../../../packages/src/lib/api-resource-manager.js',
)
const OUTPUT_DIR = path.join(__dirname, '../content/docs/api-reference')
const TYPES_SLUG = 'types'

// Groups mirror the README's existing structure, so the generated reference
// reads the same way the hand-written guides do.
const GROUPS = [
  {
    title: 'Request functions',
    methods: ['query', 'queryRecord', 'findAll', 'findRecord', 'ajax'],
  },
  {
    title: 'Collection functions',
    methods: [
      'peekAll',
      'peekRecord',
      'getCollection',
      'getAlias',
      'getRequestAlias',
      'createRecord',
      'pushPayload',
      'unloadRecord',
      'clearCollection',
    ],
  },
  {
    title: 'Configuration functions',
    methods: [
      'setHost',
      'setNamespace',
      'setHeadersCommon',
      'setPayloadIncludeReference',
      'setGlobal',
    ],
  },
  {
    title: 'Root scope functions',
    methods: ['setRootScope', 'getRootScope'],
  },
  {
    title: 'Utility functions',
    methods: [
      'findBy',
      'findIndexBy',
      'filterBy',
      'uniqBy',
      'uniq',
      'groupBy',
      'mapBy',
      'firstObject',
      'lastObject',
      'mergeObjects',
      'chunkObjects',
      'sortBy',
      'sum',
      'sumBy',
      'isEmpty',
      'isPresent',
      'isEqual',
      'isNumber',
      'isNil',
      'isNull',
      'isGte',
      'isGt',
      'isLte',
      'isLt',
    ],
  },
]

// Every @typedef on the source file - rendered together on one shared page,
// since they're shapes referenced from several methods' @param/@returns tags.
const TYPEDEFS = [
  'RequestConfig',
  'CollectionRecord',
  'DefaultRequestArrayResponse',
  'DefaultRequestObjectResponse',
]

const slugify = (name) => name.toLowerCase()

/**
 * Render one identifier's `body` partial (description/params/returns/examples),
 * skipping dmd's own `header`/`member-index` partials - the MDX page supplies
 * its own heading and frontmatter instead.
 */
const renderBody = async (templateData, name, kind) => {
  const markdown = await jsdoc2md.render({
    data: templateData,
    template: `{{#identifier name="${name}" kind="${kind}"}}{{>body}}{{/identifier}}`,
  })

  return markdown.trim()
}

/**
 * jsdoc2md renders `{@link ApiResourceManager#method}` / typedef cross-references
 * as raw markdown links to anchors that only existed in the old single-file
 * DOCS.md. Rewrite them to point at this site's per-method pages and the shared
 * types page instead, so nothing links into a 404.
 */
const rewriteCrossReferences = (markdown, methodSlugByName) => {
  let output = markdown

  for (const [name, slug] of Object.entries(methodSlugByName)) {
    output = output.replaceAll(
      new RegExp(`\\[ApiResourceManager#${name}\\]\\(ApiResourceManager#${name}\\)`, 'g'),
      `[\`${name}()\`](/docs/api-reference/${slug})`,
    )
  }

  for (const typedefName of TYPEDEFS) {
    output = output.replaceAll(
      new RegExp(`\\(#${typedefName}\\)`, 'g'),
      `(/docs/api-reference/${TYPES_SLUG}#${slugify(typedefName)})`,
    )
  }

  return output
}

const main = async () => {
  await rm(OUTPUT_DIR, { recursive: true, force: true })
  await mkdir(OUTPUT_DIR, { recursive: true })

  const templateData = await jsdoc2md.getTemplateData({ files: SOURCE_FILE })
  const methodSlugByName = Object.fromEntries(
    GROUPS.flatMap((group) => group.methods).map((name) => [name, slugify(name)]),
  )

  const metaEntries = {}

  for (const group of GROUPS) {
    for (const name of group.methods) {
      const symbol = templateData.find(
        (entry) => entry.name === name && entry.kind === 'function',
      )

      if (!symbol) {
        console.warn(`[generate-api-reference] no JSDoc found for "${name}" - skipping`)
        continue
      }

      const rawBody = await renderBody(templateData, name, 'function')
      const body = rewriteCrossReferences(rawBody, methodSlugByName)
      const slug = slugify(name)
      const description = (symbol.description || '')
        .replace(/\n+/g, ' ')
        .replace(/"/g, "'")
        .slice(0, 155)

      const frontmatter = ['---', `title: ${name}()`, `description: "${description}"`, '---', ''].join(
        '\n',
      )

      await writeFile(
        path.join(OUTPUT_DIR, `${slug}.mdx`),
        `${frontmatter}# ${name}()\n\n${body}\n`,
      )

      metaEntries[slug] = name
    }
  }

  // Shared "Types" page - one section per @typedef, each with an explicit
  // lowercase anchor id so the rewritten cross-reference links above resolve.
  const typeSections = await Promise.all(
    TYPEDEFS.map(async (typedefName) => {
      const rawBody = await renderBody(templateData, typedefName, 'typedef')
      const body = rewriteCrossReferences(rawBody, methodSlugByName)
      return `## ${typedefName}\n\n${body}\n`
    }),
  )

  await writeFile(
    path.join(OUTPUT_DIR, `${TYPES_SLUG}.mdx`),
    [
      '---',
      'title: Types',
      'description: Shared object shapes (RequestConfig, CollectionRecord, and the request response shapes) referenced across the API reference.',
      '---',
      '',
      '# Types',
      '',
      "Object shapes referenced from more than one method's parameters or return value.",
      '',
      typeSections.join('\n'),
    ].join('\n'),
  )
  metaEntries[TYPES_SLUG] = 'Types'

  await writeFile(
    path.join(OUTPUT_DIR, '_meta.js'),
    `// Auto-generated by scripts/generate-api-reference.mjs - do not edit by hand.\nexport default ${JSON.stringify(
      { index: 'Overview', ...metaEntries },
      null,
      2,
    )}\n`,
  )

  await writeFile(
    path.join(OUTPUT_DIR, 'index.mdx'),
    [
      '---',
      'title: API Reference',
      'description: Full public API reference for ApiResourceManager, generated from its JSDoc comments.',
      '---',
      '',
      '# API Reference',
      '',
      'Every page below is generated from the JSDoc comments on `ApiResourceManager` in',
      '`packages/src/lib/api-resource-manager.js` via `yarn docs:generate` - it never drifts',
      'from the source. Internal/private methods (prefixed with `_`) are intentionally left',
      "out of this public reference; see the repo's own `DOCS.md` for the full internal listing.",
      '',
    ].join('\n'),
  )

  const generatedCount = (await readdir(OUTPUT_DIR)).filter((file) =>
    file.endsWith('.mdx'),
  ).length

  console.log(`[generate-api-reference] wrote ${generatedCount} pages to ${OUTPUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
