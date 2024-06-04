import { ARM } from './index.js'

const Controller = (props) => {
  const customerAddresses = ARM.getAlias('customerAddresses', [])
  const addresses = ARM.getCollection('addresses', [])

  const unloadRecord = (record) => {
    ARM.unloadRecord(record)
  }

  const createRecord = () => {
    const newRecord = ARM.createRecord('addresses')
    newRecord.setProperties({
      attributes: {
        address1: 'Imus, Cavite, Philippines',
        address2: new Date().getTime(),
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
            type: 'areas',
            id: '166',
          },
        },
      },
      type: 'addresses',
    })

    newRecord.save()
  }

  return { customerAddresses, addresses, unloadRecord, createRecord }
}

export default Controller
