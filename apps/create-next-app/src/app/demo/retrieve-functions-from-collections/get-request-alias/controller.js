'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  return {
    addresses: ARM.getRequestAlias('customerAddresses'),
  }
}

export default Controller
