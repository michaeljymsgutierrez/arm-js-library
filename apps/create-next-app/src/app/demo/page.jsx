'use client'

import { useState } from 'react'
import Link from 'next/link'

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

const DemoPage = () => {
  const links = [
    '/demo/collection-records/getter-setter-functions',
    '/demo/collection-records/request-retrieve-functions/destroy-record',
    '/demo/collection-records/request-retrieve-functions/get-collection',
    '/demo/collection-records/request-retrieve-functions/reload',
    '/demo/collection-records/request-retrieve-functions/save',
    '/demo/collection-records/state-properties',
    '/demo/create-collection-record-function/create-record',
    '/demo/push-collection-record-function/push-payload',
    '/demo/remove-collection-records-functions/clear-collection',
    '/demo/remove-collection-records-functions/unload-record',
    '/demo/request-functions-from-server/find-all',
    '/demo/request-functions-from-server/find-record',
    '/demo/request-functions-from-server/passed-arguments',
    '/demo/request-functions-from-server/query-record',
    '/demo/request-functions-from-server/query',
    '/demo/request-functions-from-server/returned-object',
    '/demo/retrieve-functions-from-collections/get-alias',
    '/demo/retrieve-functions-from-collections/get-request-alias',
    '/demo/retrieve-functions-from-collections/get-collection',
    '/demo/retrieve-functions-from-collections/peek-all',
    '/demo/retrieve-functions-from-collections/peek-record',
  ]

  const [searchTerm, setSearchTerm] = useState('')

  const filteredLinks = links.filter((link) =>
    link.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <a href="https://www.npmjs.com/package/arm-js-library">
          <img
            src="https://assets-omega-neon.vercel.app/images/arm-js-title-logo.png"
            alt="arm-js-logo"
            height="200"
            width="143.7"
            className="my-8 mx-auto"
          />
        </a>
        <input
          type="text"
          placeholder="Search demo links..."
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredLinks.map((link) => (
            <li key={link}>
              <Link
                href={link}
                className="text-gray-700 hover:text-blue-500 text-lg block py-2 px-4 font-medium">
                {highlightMatch(link.replace('/demo/', ''), searchTerm)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DemoPage
