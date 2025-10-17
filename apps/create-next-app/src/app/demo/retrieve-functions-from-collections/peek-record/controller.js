'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  return {
    address: ARM.peekRecord('addresses', 2519858),
  }
}

export default Controller
