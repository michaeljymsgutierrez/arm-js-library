import { killConsole } from '../helpers'

const execInternalsTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Internal functions', () => {
    test('Verify pushPayload functionality', async () => {
      // ARM.clearCollection('addresses')
      // expect(ARM.getCollection('addresses')).toHaveLength(0)
      //
      // const results = await ARM.ajax({
      //   method: 'get',
      //   url: 'addresses',
      // })
      //
      // ARM.pushPayload('addresses', results.data.data)
      //
      // expect(ARM.getCollection('addresses')).toHaveLength(12)
    })
  })
}

export default execPushTest
