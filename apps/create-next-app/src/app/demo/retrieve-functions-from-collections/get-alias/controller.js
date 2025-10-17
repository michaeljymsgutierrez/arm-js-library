'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  return {
    addresses: ARM.getAlias('customerAddresses', []),
  }
}

export default Controller
