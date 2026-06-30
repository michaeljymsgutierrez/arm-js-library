const execCreateTest = (ARM) => {
  describe('Create collection record function', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
    })

    test('Verify createRecord functionality', async () => {
      ARM.createRecord('addresses', false)
      expect(ARM.getCollection('addresses')).toHaveLength(1)

      ARM.clearCollection('addresses')
      expect(ARM.getCollection('addresses')).toHaveLength(0)

      for (let count = 0; count < 5; count++) {
        ARM.createRecord('addresses')
      }
      expect(ARM.getCollection('addresses')).toHaveLength(5)
    })

    test('Verify createRecord with custom attributes', () => {
      const record = ARM.createRecord('addresses', {
        attributes: { address1: 'Test Address', kind: 'office' },
      })

      expect(record.get('attributes.address1')).toBe('Test Address')
      expect(record.get('attributes.kind')).toBe('office')
      expect(record.get('id')).toBeDefined()
    })
  })
}

export default execCreateTest
