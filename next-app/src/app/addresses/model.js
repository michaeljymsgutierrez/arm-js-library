'use client'

import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const data = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    { alias: 'customerAddresses' }
  )

  return data
}

export default Model
