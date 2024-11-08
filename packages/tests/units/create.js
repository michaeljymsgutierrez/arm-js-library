import { v1 as uuidv1 } from 'uuid'
import { killConsole } from '../helpers'

const execCreateTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Create collection record function', () => {
    test('Verify createRecord functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      ARM.createRecord('addresses', false)
      expect(ARM.getCollection('addresses')).toHaveLength(1)

      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      for (let count = 0; count < 5; count++) {
        ARM.createRecord('addresses')
      }
      expect(ARM.getCollection('addresses')).toHaveLength(5)
    })
  })
}

export default execCreateTest
