import { useEffect } from 'react'
import { ARM } from './index.js'

const Model = () => {
  useEffect(() => {
    // ARM.query(
    //   'addresses',
    //   {
    //     sort: '-id',
    //     include: 'user',
    //   },
    //   { alias: 'customerAddresses' }
    // )
    // ARM.queryRecord(
    //   'addresses',
    //   {
    //     sort: '-id',
    //     include: 'user',
    //   },
    //   { alias: 'customerAddresses' }
    // )
    ARM.findAll('addresses', {
      alias: 'customerAddresses',
    })
  }, [])
}

export default Model
