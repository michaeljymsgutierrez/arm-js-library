'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Controller = () => {
  const address = ARM.createRecord(
    'addresses',
    {
      attributes: {
        address1: 'Paseo de Roxas, Makati, Metro Manila, Philippines',
        address2: 'Unit 100, 10th Floor',
        city: 'Makati',
        'post-code': '1225',
        landmark: 'Near Ayala Triangle Gardens',
        kind: 'home',
        label: 'Zuellig Building',
        latitude: '14.557843',
        longitude: '121.026661',
      },
    },
    false
  )

  const onSave = () => {
    address.save()
  }

  return { address, onSave }
}

export default Controller
