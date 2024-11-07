import { v1 as uuidv1 } from 'uuid'
import { killConsole, reviveConsole } from '../helpers'

const execRemoveAndPushTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Remove collection record functions', () => {
    test('Verify clearCollection functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)
    })

    test('Verify unloadRecord functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      ARM.unloadRecord(ARM.peekRecord('addresses', 2518368))
      expect(ARM.getCollection('addresses')).toHaveLength(11)
    })
  })

  describe('Push collection record function', () => {
    test('Verify pushPayload functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      const results = await ARM.ajax({
        method: 'get',
        url: 'addresses',
      })

      ARM.pushPayload('addresses', results.data.data)

      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })
  })
}

export default execRemoveAndPushTest
