'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  return {
    // Alias serve as identifier for the records obtain from the server.
    // Can be used anywhere in your application through ARM.getAlias('customerAddress')
    customerAddress: ARM.getAlias('customerAddress'),
  }
}

export default Controller
