'use client'

import dynamic from 'next/dynamic'

// ssr: false - ARM touches window/document, which don't exist during server rendering.
const ARMConfigProvider = dynamic(
  () => import('@/components/providers/arm-config-provider'),
  { ssr: false },
)

const ApplicationProviders = ({ children }) => {
  return <ARMConfigProvider>{children}</ARMConfigProvider>
}

export default ApplicationProviders
