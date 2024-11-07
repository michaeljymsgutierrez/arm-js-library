import { v1 as uuidv1 } from 'uuid'
import { killConsole } from '../helpers'

const execRequestTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Request functions from server', () => {
    test('Verify query functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })

    test('Verify queryRecord functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.queryRecord(
        'addresses',
        {
          filter: { id: 2519858 },
        },
        { autoResolve: false, skipId: uuidv1() }
      )
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })

    test('Verify findRecord functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.findRecord('addresses', 2518368, null, {
        autoResolve: false,
        skipId: uuidv1(),
      })
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })

    test('Verify findAll functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.findAll('addresses', { autoResolve: false, skipId: uuidv1() })
      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })
  })
}

export default execRequestTest
