import { useEffect } from 'react'
import { ARM } from './index.js'

const Model = () => {
  useEffect(() => {
    ARM.queryRecord(
      'addresses',
      {
        id: 2427861,
        sort: '-id',
        include: 'user',
      },
      { alias: 'customerAddresses' }
    )
  }, [])
}

export default Model
