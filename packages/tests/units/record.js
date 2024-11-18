import { v1 as uuidv1 } from 'uuid'
import { killConsole, reviveConsole } from '../helpers'

const execRecordTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Collection Records: Properties and Functions', () => {
    describe('State Properties', () => {
      test('Verify isLoading functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

        await ARM.findAll('addresses', { autoResolve: false, skipId: uuidv1() })
        const record = ARM.peekRecord('addresses', 2519858)

        record.set(
          'attributes.address1',
          'Paseo de Roxas, Makati, Metro Manila, Philippines Modified'
        )
        expect(record.get('isError')).toBe(false)

        try {
          await record.save()
        } catch (err) {
          expect(record.get('isError')).toBe(true)
        }
      })

      test('Verify isPristine functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        expect(record.get('attributes.address1')).toBe('Anabu Hills Test 4')
      })

      test('Verify set functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        record.set('attributes.address1', 'Anabu Hills Modified')
        expect(record.get('attributes.address1')).toBe('Anabu Hills Modified')
      })

      test('Verify setProperties functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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

      test('Verify reload functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

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

      test('Verify destroyRecord functionality', async () => {
        ARM.clearCollection('addresses')
        expect(ARM.getCollection('addresses')).toHaveLength(0)

        await ARM.findRecord('addresses', 2518368, null, {
          autoResolve: false,
          skipId: uuidv1(),
        })
        const record = ARM.peekRecord('addresses', 2518368)
        const result = await record.destroyRecord()

        expect(result).toBeDefined()
        expect(ARM.peekRecord('addresses', 2518368)).toBeUndefined()
      })
    })
  })
}

export default execRecordTest
