import { v1 as uuidv1 } from 'uuid'
import { killConsole, reviveConsole } from '../helpers'

const execRecordTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Collection Records: Properties and Functions', () => {
    describe('Getter and Setter Functions', () => {
      test('Verify get functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })
    })
  })
}

export default execRecordTest
