const execRequestAndRetrieveTest = (ARM) => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {})

  describe('Request functions from server', () => {
    test('Verify query functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false })
      expect(ARM.getCollection('addresses').length).toBe(12)
    })
  })
}

export default execRequestAndRetrieveTest
