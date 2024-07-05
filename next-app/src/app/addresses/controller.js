'use client'

import { ARM } from '@arm-config-wrapper'

const Controller = (props) => {
  const addresses = ARM.getAlias('customerAddresses', [])

  return { addresses }
}

export default Controller
