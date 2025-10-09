'use client'

import dynamic from 'next/dynamic'

const ARMConfigProvider = dynamic(
  () => import('@/components/providers/arm-config-provider'),
  { ssr: false }
)

/**
 * ApplicationProviders
 *
 * This component is used to provide the application with the necessary
 * providers for the application to function properly.
 */
const ApplicationProviders = ({ children }) => {
  return (
    <>
      <ARMConfigProvider>{children}</ARMConfigProvider>
    </>
  )
}

export default ApplicationProviders
