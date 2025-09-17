'use client'

import ApiResourceManager from 'arm-js-library'
import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
import { COLLECTIONS, API_BASE_URL, API_NAMESPACE } from '@constants'

export const ARM = new ApiResourceManager(COLLECTIONS)

ARM.setHost(API_BASE_URL)
ARM.setNamespace(API_NAMESPACE)
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

/* ARMConfigProvider
 *
 * This component is used to configure the ARM library with the necessary
 * headers and settings for the application to function properly.
 */
const ARMConfigProvider = ({ children }) => {
  const [isSessionResolved, setIsSessionResolved] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.token)
      ARM.setHeadersCommon('Authorization', `Token ${session.user.token}`)

    if (status === 'authenticated' || status === 'unauthenticated')
      setIsSessionResolved(true)
  }, [session, status, session?.user?.token])

  if (isSessionResolved === false) return null

  return <>{children}</>
}

export default ARMConfigProvider
