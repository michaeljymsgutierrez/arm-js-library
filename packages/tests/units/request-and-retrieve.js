const turnOffConsole = () => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
}

const turnOnConsole = () => {
  console.log.mockRestore()
  console.error.mockRestore()
  console.groupCollapsed.mockRestore()
}

const execRequestAndRetrieveTest = (ARM) => {
  turnOffConsole()

  ARM.setNamespace('api/v1')

  describe('Request functions from server', () => {
    test('Verify query functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.query('addresses', {}, { autoResolve: false })
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
        { autoResolve: false }
      )
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })

    test('Verify findRecord functionality', async () => {
      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      await ARM.findRecord('addresses', 2518368, null, { autoResolve: false })
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })
  })
}

export default execRequestAndRetrieveTest
