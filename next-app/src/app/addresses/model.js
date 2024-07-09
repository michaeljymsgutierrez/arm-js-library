'use client'

import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const user = ARM.findRecord('users', 12980860, null, {})

  const addresses = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    {
      alias: 'customerAddresses',
      skip: user.isLoading,
    }
  )

  return addresses
}

export default Model
