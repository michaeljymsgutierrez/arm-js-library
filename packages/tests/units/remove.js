import { v1 as uuidv1 } from 'uuid'

const execRemoveTest = (ARM) => {
  describe('Remove collection record functions', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
    })

    test('Verify clearCollection functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.getCollection('addresses')).toHaveLength(12)

      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)
    })

    test('Verify unloadRecord functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      ARM.unloadRecord(ARM.peekRecord('addresses', 2518368))
      expect(ARM.getCollection('addresses')).toHaveLength(11)
    })

    test('Verify unloadRecord removes record from aliases', async () => {
      await ARM.query(
        'addresses',
        {},
        {
          autoResolve: false,
          alias: 'allAddressesAlias',
          skipId: uuidv1(),
        },
      )
      expect(ARM.getAlias('allAddressesAlias')).toHaveLength(12)

      ARM.unloadRecord(ARM.peekRecord('addresses', 2518368))
      expect(ARM.getAlias('allAddressesAlias')).toHaveLength(11)
    })
  })
}

export default execRemoveTest
