import Link from 'next/link'
import ArmLogo from '@/components/arm-logo'

/**
 * DemoPage
 *
 * Consistent chrome for every demo route: a title, the method call it's
 * demonstrating, and a link back to the matching docs guide - the one piece
 * tying each demo page back to its docs guide (there is no demo index page).
 */
const DemoPage = ({ title, method, guideHref, children }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="inline-block mb-4">
        <ArmLogo height={32} />
      </Link>
      <h1 className="text-xl font-bold">{title}</h1>
      {method && (
        <code className="block mt-1 mb-4 text-sm text-gray-600">{method}</code>
      )}
      {guideHref && (
        <p className="mb-4">
          <Link href={guideHref} className="text-sky-600 hover:underline">
            View this guide in the docs -&gt;
          </Link>
        </p>
      )}
      {children}
    </div>
  )
}

export default DemoPage
