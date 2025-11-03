'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return {
    addresses: ARM.query('addresses', {}),
  }
}

export default Model
