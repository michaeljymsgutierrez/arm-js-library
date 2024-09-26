'use client'

import { useSearchParams } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const searchParams = useSearchParams()
  // const user = ARM.findRecord('users', 12980860, null, {})

  const addresses = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    {
      alias: 'customerAddresses',
      skipId: searchParams.get('skipId'),
      override: {
        headers: {
          'X-Client-Platform': 'Android',
        },
      },
      // skip: user.isLoading,
      // skip: false,
    }
  )

  ARM.findRecord('addresses', 2511445, null)

  return addresses
}

export default Model
