'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  return {
    addresses: ARM.peekAll('addresses'),
  }
}

export default Controller
