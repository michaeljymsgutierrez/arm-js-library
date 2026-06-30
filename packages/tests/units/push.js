const execPushTest = (ARM) => {
  describe('Push collection record function', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
      ARM.clearCollection('users')
    })

    test('Verify pushPayload functionality', async () => {
      const results = await ARM.ajax({
        method: 'get',
        url: 'addresses',
      })

      ARM.pushPayload('addresses', results.data.data)
      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })

    test('Verify pushPayload with multiple collections', async () => {
      const results = await ARM.ajax({
        method: 'get',
        url: 'addresses',
        params: { include: 'users' },
      })

      ARM.pushPayload('addresses', results.data.data)
      ARM.pushPayload('users', results.data.included)

      expect(ARM.getCollection('addresses')).toHaveLength(12)
      expect(ARM.getCollection('users')).toHaveLength(1)
    })
  })
}

export default execPushTest
