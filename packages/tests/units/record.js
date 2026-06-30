import { v1 as uuidv1 } from 'uuid'

const execRecordTest = (ARM) => {
  describe('Collection Records: Properties and Functions', () => {
    beforeEach(() => {
      ARM.clearCollection('addresses')
    })

    describe('State Properties', () => {
      test('Verify isLoading functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        const recordResult = record.save()
        expect(record.get('isLoading')).toBe(true)

        await recordResult
        expect(record.get('isLoading')).toBe(false)
      })

      test('Verify isDirty functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.set('attributes.address1', 'Anabu Hills Modified')
        expect(record.get('isDirty')).toBe(true)
        const recordResult = record.save()

        await recordResult
        expect(record.get('isDirty')).toBe(false)
      })

      test('Verify isError functionality', async () => {
        await ARM.findAll('addresses', { autoResolve: false, skipId: uuidv1() })
        const record = ARM.peekRecord('addresses', 2519858)

        record.set(
          'attributes.address1',
          'Paseo de Roxas, Makati, Metro Manila, Philippines Modified',
        )
        expect(record.get('isError')).toBe(false)

        try {
          await record.save()
        } catch {
          expect(record.get('isError')).toBe(true)
        }
      })

      test('Verify isPristine functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.set('attributes.address1', 'Anabu Hills Modified')
        expect(record.get('isPristine')).toBe(false)
        const recordResult = record.save()

        await recordResult
        expect(record.get('isPristine')).toBe(true)
      })
    })

    describe('Getter and Setter Functions', () => {
      test('Verify get functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })

      test('Verify set functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        record.set('attributes.address1', 'Anabu Hills Modified')
        expect(record.get('attributes.address1')).toBe('Anabu Hills Modified')
      })

      test('Verify setProperties functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        record.setProperties({
          attributes: {
            address1: 'New address1 changes',
            address2: 'New address2 changes',
          },
        })
        expect(record.get('attributes.address1')).toBe('New address1 changes')
        expect(record.get('attributes.address2')).toBe('New address2 changes')
      })
    })

    describe('Request Functions', () => {
      test('Verify save functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.set('attributes.address1', 'Anabu Hills Modified')
        const result = await record.save()
        expect(result).toBeDefined()
        expect(record.get('attributes.address1')).toBe('Anabu Hills Modified')
      })

      test('Verify save functionality for new record uses POST', async () => {
        const record = ARM.createRecord('addresses', {
          attributes: { address1: 'New Address', kind: 'office', label: 'My New Office' },
        })
        const result = await record.save()
        expect(result).toBeDefined()
      })

      test('Verify save with string collection record id uses PUT', async () => {
        ARM.pushPayload('addresses', [
          {
            id: 'string-record-id',
            type: 'addresses',
            attributes: { address1: 'String ID Test', kind: 'office' },
          },
        ])
        const record = ARM.peekRecord('addresses', 'string-record-id')
        expect(record).toBeDefined()

        record.set('attributes.address1', 'String ID Test Modified')
        const result = await record.save()
        expect(result).toBeDefined()
        expect(record.get('attributes.address1')).toBe('String ID Test Modified')
      })

      test('Verify reload functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.set('attributes.address1', 'Anabu Hills Modified')
        const result = await record.reload()
        expect(result).toBeDefined()
        expect(record.get('isPristine')).toBe(true)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })

      test('Verify rollbackAttributes functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.set('attributes.address1', 'Anabu Hills Modified')
        record.rollbackAttributes()

        expect(record.get('isPristine')).toBe(true)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })

      test('Verify rollbackAttributes after setProperties', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)

        record.setProperties({
          attributes: {
            address1: 'New address1 changes',
            address2: 'New address2 changes',
          },
        })
        expect(record.get('isPristine')).toBe(false)

        record.rollbackAttributes()
        expect(record.get('isPristine')).toBe(true)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })

      test('Verify destroyRecord functionality', async () => {
        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        const result = await record.destroyRecord()

        expect(result).toBeDefined()
        expect(ARM.peekRecord('addresses', 2518368)).toBeUndefined()
      })

      test('Verify getCollection functionality', async () => {
        await ARM.query(
          'addresses',
          {
            include: 'users',
          },
          { autoResolve: false, skipId: uuidv1() },
        )
        const record = ARM.peekRecord('addresses', 2518368)
        const user = record.getCollection('users', {
          referenceKey: 'relationships.user.data',
          async: false,
        })

        expect(user).toBeDefined()
        expect(user.get('id')).toBe(12980860)
      })
    })
  })
}

export default execRecordTest
