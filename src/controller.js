import { ARM } from './index.js'

const Controller = (props) => {
  const customerAddresses = ARM.getAlias('customerAddresses', [])
  const addresses = ARM.getCollection('addresses', [])

  const unloadRecord = (record) => {
    ARM.unloadRecord(record)
  }

  return { customerAddresses, addresses, unloadRecord }
}

export default Controller
