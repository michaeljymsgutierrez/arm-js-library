import Link from 'next/link'

/**
 * DemoPage
 *
 * Consistent chrome for every demo route: a title, the method call it's
 * demonstrating, and a link back to the matching docs guide - the one piece
 * tying the live /demo section back to /docs together.
 */
const DemoPage = ({ title, method, guideHref, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/demo" className="text-sky-600 hover:underline">
          &larr; All demos
        </Link>
      </div>
      <h1 className="text-xl font-bold">{title}</h1>
      {method && (
        <code className="block mt-1 mb-4 text-sm text-gray-600">{method}</code>
      )}
      {guideHref && (
        <p className="mb-4">
          <Link href={guideHref} className="text-sky-600 hover:underline">
            View this guide in the docs &rarr;
          </Link>
        </p>
      )}
      {children}
    </div>
  )
}

export default DemoPage
