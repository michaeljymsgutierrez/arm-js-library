import { v1 as uuidv1 } from 'uuid'

const execRequestTest = (ARM) => {
  describe('Request functions from server', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
    })

    test('Verify query functionality', async () => {
      await ARM.query('addresses', {}, { autoResolve: false, skipId: uuidv1() })
      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })

    test('Verify queryRecord functionality', async () => {
      await ARM.queryRecord(
        'addresses',
        {
          filter: { id: 2519858 },
        },
        { autoResolve: false, skipId: uuidv1() },
      )
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })

    test('Verify findRecord functionality', async () => {
      await ARM.findRecord('addresses', 2518368, null, {
        autoResolve: false,
        skipId: uuidv1(),
      })
      expect(ARM.getCollection('addresses')).toHaveLength(1)
    })

    test('Verify findAll functionality', async () => {
      await ARM.findAll('addresses', { autoResolve: false, skipId: uuidv1() })
      expect(ARM.getCollection('addresses')).toHaveLength(12)
    })

    test('Verify reload functionality', async () => {
      const result = await ARM.findRecord('addresses', 2518368, null, {
        autoResolve: false,
        skipId: uuidv1(),
      })
      const record = ARM.peekRecord('addresses', 2518368)

      record.set('attributes.address1', 'Anabu Hills Modified')
      result.reload()

      await new Promise((resolve) => setTimeout(resolve, 700))

      expect(record.get('isPristine')).toBe(true)
      expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
    }, 5000)

    test('Verify autoResolve default behavior returns reactive hash object', () => {
      // query() returns the initial hash object synchronously. When XHR completes,
      // _pushRequestHash replaces (not mutates) the entry in requestHashes, making
      // the captured reference stale - so only the initial shape can be asserted here.
      const result = ARM.query('addresses', {}, { skipId: uuidv1() })

      expect(result).not.toBeInstanceOf(Promise)
      expect(result).toHaveProperty('isLoading')
      expect(result).toHaveProperty('isNew')
      expect(result).toHaveProperty('data')
      expect(result.isLoading).toBe(true)
      expect(result.isNew).toBe(true)
      expect(result.data).toEqual([])
    })
  })
}

export default execRequestTest
