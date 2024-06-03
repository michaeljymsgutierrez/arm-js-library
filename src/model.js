import { useEffect } from 'react'
import { ARM } from './index.js'

const Model = () => {
  useEffect(() => {
    ARM.query(
      'addresses',
      {
        sort: '-id',
        include: 'user',
      },
      { alias: 'customerAddresses' }
    )
  }, [])
}

export default Model
