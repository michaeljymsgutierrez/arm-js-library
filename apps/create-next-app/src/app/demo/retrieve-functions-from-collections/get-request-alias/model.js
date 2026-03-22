'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return {
    addresses: ARM.findAll('addresses', { alias: 'customerAddresses' }),
  }
}

export default Model
