'use client'

import { useParams } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const params = useParams()
  const address = ARM.findRecord('addresses', params.id, null, {
    alias: 'editAddress',
  })

  return address
}

export default Model
