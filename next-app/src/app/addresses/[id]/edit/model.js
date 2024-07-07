'use client'

import { useParams } from 'next/navigation'
import { ARM } from '@arm-config-wrapper'

const Model = () => {
  const params = useParams()
  const data = ARM.findRecord('addresses', params.id, null, {
    alias: 'editAddress',
  })

  return data
}

export default Model
