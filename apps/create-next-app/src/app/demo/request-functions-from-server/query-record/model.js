'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return {
    addresses: ARM.queryRecord('addresses', {
      filter: { id: 2519858 },
    }),
  }
}

export default Model
