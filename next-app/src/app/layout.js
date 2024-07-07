import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

const ARMConfigWrapper = dynamic(
  () => import('../components/arm-config-wrapper'),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'arm-js-library for next-js',
  description: 'demo app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ARMConfigWrapper>{children}</ARMConfigWrapper>
      </body>
    </html>
  )
}
