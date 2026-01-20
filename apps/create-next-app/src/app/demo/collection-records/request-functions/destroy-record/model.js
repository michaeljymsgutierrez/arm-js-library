'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return ARM.findRecord('addresses', 2519858, { include: 'user' })
}

export default Model
