'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  const addresses = ARM.getCollection('addresses')

  const onPushRecord = () => {
    ARM.ajax({
      url: '/addresses/2518368',
      method: 'GET',
    }).then((response) => {
      ARM.pushPayload('addresses', response.data.data)
    })
  }

  return {
    addresses,
    onPushRecord,
  }
}

export default Controller
