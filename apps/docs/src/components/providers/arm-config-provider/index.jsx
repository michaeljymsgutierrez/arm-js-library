'use client'

import ApiResourceManager from 'arm-js-library'

const COLLECTIONS = ['addresses', 'users']

export const ARM = new ApiResourceManager(COLLECTIONS)

// No setHost() call - ARM defaults to window.location.origin, and the demo's
// API routes live in this same app (app/api/v1/**), so same-origin is always
// correct whether this runs on localhost or the deployed Vercel URL.
ARM.setNamespace('api/v1')
ARM.setHeadersCommon('Content-Type', 'application/vnd.api+json')
ARM.setHeadersCommon('X-Client-Platform', 'Web')
ARM.setGlobal()

const ARMConfigProvider = ({ children }) => {
  return <>{children}</>
}

export default ARMConfigProvider
