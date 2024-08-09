'use client'

import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const items = ARM.query('items', {
    filer: { status: 'in-cart' },
    include: 'product'
  })

  return items
}

export default Model
