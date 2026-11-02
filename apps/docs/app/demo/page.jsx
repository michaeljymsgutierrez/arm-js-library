'use client'

import { useState } from 'react'
import Link from 'next/link'

const DEMOS = [
  { href: '/demo/request-functions-from-server/query', label: 'query()' },
  { href: '/demo/request-functions-from-server/query-record', label: 'queryRecord()' },
  { href: '/demo/request-functions-from-server/find-all', label: 'findAll()' },
  { href: '/demo/request-functions-from-server/find-record', label: 'findRecord()' },
  { href: '/demo/request-functions-from-server/passed-arguments', label: 'Passed arguments (config)' },
  { href: '/demo/request-functions-from-server/returned-object', label: 'Returned object (isLoading/data/reload)' },
  { href: '/demo/retrieve-functions-from-collections/peek-all', label: 'peekAll()' },
  { href: '/demo/retrieve-functions-from-collections/peek-record', label: 'peekRecord()' },
  { href: '/demo/retrieve-functions-from-collections/get-collection', label: 'getCollection()' },
  { href: '/demo/retrieve-functions-from-collections/get-alias', label: 'getAlias()' },
  { href: '/demo/retrieve-functions-from-collections/get-request-alias', label: 'getRequestAlias()' },
  { href: '/demo/create-collection-record-function/create-record', label: 'createRecord()' },
  { href: '/demo/push-collection-record-function/push-payload', label: 'pushPayload()' },
  { href: '/demo/remove-collection-records-functions/unload-record', label: 'unloadRecord()' },
  { href: '/demo/remove-collection-records-functions/clear-collection', label: 'clearCollection()' },
  { href: '/demo/collection-records/state-properties', label: 'Record state properties' },
  { href: '/demo/collection-records/getter-setter-functions', label: 'Record get()/set()/setProperties()' },
  { href: '/demo/collection-records/request-retrieve-functions/save', label: 'record.save()' },
  { href: '/demo/collection-records/request-retrieve-functions/reload', label: 'record.reload()' },
  { href: '/demo/collection-records/request-retrieve-functions/rollback-attributes', label: 'record.rollbackAttributes()' },
  { href: '/demo/collection-records/request-retrieve-functions/destroy-record', label: 'record.destroyRecord()' },
  { href: '/demo/collection-records/request-retrieve-functions/get-collection', label: 'record.getCollection()' },
]

const highlightMatch = (text, searchTerm) => {
  if (!searchTerm) return text
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

const DemoIndexPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDemos = DEMOS.filter((demo) =>
    demo.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <a href="https://www.npmjs.com/package/arm-js-library">
          <img
            className="mx-auto mb-4"
            src="https://assets-omega-neon.vercel.app/images/arm-js-title-logo.png"
            alt="arm-js-logo"
            height={120}
            width={86}
          />
        </a>

        <h1 className="text-xl font-bold mb-1">Live Demo</h1>
        <p className="text-sm text-gray-600 mb-4">
          Every method below runs against a real API (this app's own{' '}
          <code>/api/v1</code> routes) - open one up and watch the reactive
          state update as you interact with it.{' '}
          <Link href="/docs" className="text-sky-600 hover:underline">
            Back to docs
          </Link>
        </p>

        <input
          type="text"
          placeholder="Search demos..."
          className="border border-gray-400 rounded p-2 w-full mb-4"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <ul className="space-y-1">
          {filteredDemos.map((demo) => (
            <li key={demo.href}>
              <Link href={demo.href} className="text-sky-600 hover:underline">
                {highlightMatch(demo.label, searchTerm)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DemoIndexPage
