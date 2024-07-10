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
      // skip: user.isLoading,
      // skip: false,
    }
  )

  return addresses
}

export default Model
