import { ARM } from './index.js'

const Model = () => {
  // useEffect(() => {
  //   const data = ARM.query(
  //     'addresses',
  //     {
  //       sort: '-id',
  //       include: 'user',
  //     },
  //     { alias: 'customerAddresses' }
  //   )
  //   console.log(data)
  //   // console.log(data)
  // }, [])

  const data = ARM.query(
    'addresses',
    {
      sort: '-id',
      include: 'user',
    },
    { alias: 'customerAddresses' }
  )

  // ARM.query(
  //   'addresses',
  //   {
  //     sort: '-id',
  //     include: 'user',
  //   },
  //   { alias: 'customerAddresses' }
  // )
  //
  // if (modelCustomerAddresses.length > 1) {
  //   const address = modelCustomerAddresses[0]
  //   const hasAddressId = address.get('id')
  //   console.log("Done fetching", address.get('id'))
  //   ARM.findRecord('addresses', address.get('id'), { skip: hasAddressId })
  // }

  // ARM.queryRecord(
  //   'addresses',
  //   {
  //     sort: '-id',
  //     include: 'user',
  //   },
  //   { alias: 'customerAddresses' }
  // )

  // ARM.findAll('addresses', {
  //   alias: 'customerAddresses',
  // })

  ARM.findRecord(
    'addresses',
    2459146,
    {
      include: 'user',
    },
    {
      alias: 'customerAddress',
    }
  )
  return data
}

export default Model
