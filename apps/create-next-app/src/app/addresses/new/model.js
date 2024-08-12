'use client'

import { ARM } from '@arm-config-wrapper'
import { useEffect } from 'react'

const Model = () => {
  const address = ARM.createRecord(
    'addresses',
    {
      attributes: {
        address1: null,
        address2: null,
        landmark: null,
        city: null,
        'post-code': null,
        kind: 'home',
        label: 'Anabu Hills',
        latitude: 14.394261,
        longitude: 120.940783,
      },
      relationships: {
        user: {
          data: null,
        },
        area: {
          data: {
            id: '166',
          },
        },
      },
    },
    false
  )

  return address
}

export default Model
