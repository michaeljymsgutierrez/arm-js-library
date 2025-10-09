'use client'

import ApiResourceManager from 'arm-js-library'
// import { useSession } from 'next-auth/react'
// import { useEffect, useState } from 'react'

const COLLECTIONS = ['addresses', 'users']

export const ARM = new ApiResourceManager(COLLECTIONS)

ARM.setHost('http://localhost:3001')
ARM.setNamespace('api/v1')
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

/* ARMConfigProvider
 *
 * This component is used to configure the ARM library with the necessary
 * headers and settings for the application to function properly.
 */
const ARMConfigProvider = ({ children }) => {
  /*
   * This is an example of how to use the ARM library with the session
   * provider from next-auth. This is not a requirement for the library
   * to work, but it is a good practice to use it.
   */
  // const [isSessionResolved, setIsSessionResolved] = useState(false)
  // const { data: session, status } = useSession()
  //
  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user?.token)
  //     ARM.setHeadersCommon('Authorization', `Token ${session.user.token}`)
  //
  //   if (status === 'authenticated' || status === 'unauthenticated')
  //     setIsSessionResolved(true)
  // }, [session, status, session?.user?.token])
  //
  // if (isSessionResolved === false) return null

  return <>{children}</>
}

export default ARMConfigProvider
