import { Geist, Geist_Mono } from 'next/font/google'
import ApplicationProviders from '@/components/providers/application-providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Live Demo - ARM JS Library',
  description:
    'Every ARM JS Library method running live against a real API, in the browser.',
}

export default function DemoLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApplicationProviders>{children}</ApplicationProviders>
      </body>
    </html>
  )
}
