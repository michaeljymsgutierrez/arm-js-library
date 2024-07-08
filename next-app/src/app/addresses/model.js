'use client'

import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const user = ARM.findRecord('users', 12980860, null, {})

  // const hasUserId = user.data.id ? true : false
  // console.log(hasUserId)

  const addresses = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    { alias: 'customerAddresses', skip: true }
  )

  return addresses
}

export default Model
