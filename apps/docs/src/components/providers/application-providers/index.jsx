'use client'

import dynamic from 'next/dynamic'

const ARMConfigProvider = dynamic(
  () => import('@/components/providers/arm-config-provider'),
  { ssr: false },
)

/**
 * ApplicationProviders
 *
 * Wraps the demo section with the providers it needs to function.
 */
const ApplicationProviders = ({ children }) => {
  return <ARMConfigProvider>{children}</ARMConfigProvider>
}

export default ApplicationProviders
