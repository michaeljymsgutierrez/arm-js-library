import { v1 as uuidv1 } from 'uuid'

const execRetrieveTest = (ARM) => {
  describe('Retrieve functions from collections', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
    })

    test('Verify peekAll functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.peekAll('addresses')).toHaveLength(12)
    })

    test('Verify peekRecord functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.peekRecord('addresses', 2518368).get('id')).toBe(2518368)
    })

    test('Verify peekRecord returns undefined for non-existent id', () => {
      expect(ARM.peekRecord('addresses', 9999999)).toBeUndefined()
    })

    test('Verify getCollection functionality', async () => {
      await ARM.query(
        'addresses',
        { page: { size: 5 } },
        { autoResolve: false, skipId: uuidv1() },
      )
      expect(ARM.getCollection('addresses')).toHaveLength(5)
    })

    test('Verify getAlias functionality', async () => {
      await ARM.query(
        'addresses',
        { page: { size: 5 } },
        { autoResolve: false, alias: 'customerAddresses', skipId: uuidv1() },
      )
      expect(ARM.getAlias('customerAddresses')).toHaveLength(5)
    })

    test('Verify getAlias returns fallback when alias does not exist', () => {
      const fallback = [
        { id: 999, attributes: { address1: 'Fallback Address' } },
      ]
      const result = ARM.getAlias('nonExistentAlias', fallback)
      expect(result).toBeDefined()
      expect(result).toHaveLength(1)
    })

    test('Verify getRequestAlias functionality', async () => {
      await ARM.query(
        'addresses',
        { page: { size: 5 } },
        { autoResolve: false, alias: 'customerAddresses', skipId: uuidv1() },
      )
      expect(ARM.getRequestAlias('customerAddresses')?.data).toHaveLength(5)
    })
  })
}

export default execRetrieveTest
