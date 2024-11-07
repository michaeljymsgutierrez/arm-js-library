import { v1 as uuidv1 } from 'uuid'
import { killConsole } from '../helpers'

const execRetrieveTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Retrieve functions from collections', () => {
    test('Verify peekAll functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.peekAll('addresses')).toHaveLength(12)
    })

    test('Verify peekRecord functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.peekRecord('addresses', 2518368).get('id')).toBe(2518368)
    })

    test('Verify getCollection functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.query(
        'addresses',
        { page: { size: 5 } },
        { autoResolve: false, skipId: uuidv1() }
      )
      expect(ARM.getCollection('addresses')).toHaveLength(5)
    })

    test('Verify getAlias functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.query(
        'addresses',
        { page: { size: 5 } },
        { autoResolve: false, alias: 'customerAddresses', skipId: uuidv1() }
      )
      expect(ARM.getAlias('customerAddresses')).toHaveLength(5)
    })
  })
}

export default execRetrieveTest
