import { addresses } from '../data/dummy-data'

const execUtilsTest = (ARM) => {
  describe('Utility functions', () => {
    describe('Data Retrieval and Manipulation', () => {
      test('Verify findBy functionality', () => {
        expect(ARM.findBy(addresses, { id: 1 })).toEqual(addresses[0])
      })

      test('Verify findIndexBy functionality', () => {
        expect(
          ARM.findIndexBy(addresses, {
            attributes: { kind: 'office' },
          })
        ).toEqual(0)
      })

      test('Verify filterBy functionality', () => {
        expect(
          ARM.filterBy(addresses, {
            attributes: { kind: 'school' },
          })
        ).toEqual([
          { id: 2, attributes: { kind: 'school', label: 'My School' } },
          {
            id: 3,
            attributes: { kind: 'school', label: "My Brother's School" },
          },
        ])
      })

      test('Verify uniqBy functionality', () => {
        expect(ARM.uniqBy(addresses, 'attributes.kind')).toEqual([
          { id: 1, attributes: { kind: 'office', label: 'My Office' } },
          { id: 2, attributes: { kind: 'school', label: 'My School' } },
        ])
      })

      test('Verify groupBy functionality', () => {
        expect(ARM.groupBy(addresses, 'attributes.kind')).toEqual({
          office: [
            { id: 1, attributes: { kind: 'office', label: 'My Office' } },
          ],
          school: [
            { id: 2, attributes: { kind: 'school', label: 'My School' } },
            {
              id: 3,
              attributes: { kind: 'school', label: "My Brother's School" },
            },
          ],
        })
      })

      test('Verify mapBy functionality', () => {
        expect(ARM.mapBy(addresses, 'attributes.kind')).toEqual([
          'office',
          'school',
          'school',
        ])
      })

      test('Verify firstObject functionality', () => {
        expect(ARM.firstObject(addresses)).toEqual(addresses[0])
      })

      test('Verify lastObject functionality', () => {
        expect(ARM.lastObject(addresses)).toEqual(addresses[2])
      })

      test('Verify mergeObjects functionality', () => {
        expect(
          ARM.mergeObjects([addresses[0], addresses[1]], [addresses[2]])
        ).toEqual(addresses)
      })

      test('Verify chunkObjects functionality', () => {
        expect(ARM.chunkObjects(addresses, 2)).toEqual([
          [
            { id: 1, attributes: { kind: 'office', label: 'My Office' } },
            { id: 2, attributes: { kind: 'school', label: 'My School' } },
          ],
          [
            {
              id: 3,
              attributes: { kind: 'school', label: "My Brother's School" },
            },
          ],
        ])
      })

      test('Verify sortBy functionality', () => {
        expect(ARM.sortBy(addresses, ['id:desc'])).toEqual(addresses.reverse())
      })
    })

    describe('Data Validation and Comparison', () => {
      test('Verify isEmpty functionality', () => {
        expect(ARM.isEmpty(null)).toBe(true)
        expect(ARM.isEmpty('')).toBe(true)
        expect(ARM.isEmpty(undefined)).toBe(true)
        expect(ARM.isEmpty({})).toBe(true)
        expect(ARM.isEmpty([])).toBe(true)
      })

      test('Verify isPresent functionality', () => {
        expect(ARM.isPresent('Hello world!')).toBe(true)
        expect(ARM.isPresent({ message: 'Hello world!' })).toBe(true)
        expect(ARM.isPresent({})).toBe(false)
        expect(ARM.isPresent([1, 2, 3])).toBe(true)
        expect(ARM.isPresent([])).toBe(false)
      })

      test('Verify isEqual functionality', () => {
        expect(ARM.isEqual('Hello', 'Hello')).toBe(true)
        expect(ARM.isEqual('Hello', 'world!')).toBe(false)
        expect(ARM.isEqual(1, '1')).toBe(false)
        expect(ARM.isEqual(true, 'true')).toBe(false)
        expect(ARM.isEqual({ message: 'Hello' }, { message: 'Hello' })).toBe(
          true
        )
        expect(ARM.isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
        expect(ARM.isEqual([1, 2, 3], [3, 2, 1])).toBe(false)
        expect(ARM.isEqual('', null)).toBe(false)
        expect(ARM.isEqual(undefined, null)).toBe(false)
      })

      test('Verify isNumber functionality', () => {
        expect(ARM.isNumber(1)).toBe(true)
        expect(ARM.isNumber(1 + 2)).toBe(true)
        expect(ARM.isNumber(1 + '2')).toBe(false)
        expect(ARM.isNumber('1')).toBe(false)
        expect(ARM.isNumber('')).toBe(false)
        expect(ARM.isNumber(null)).toBe(false)
        expect(ARM.isNumber(undefined)).toBe(false)
      })

      test('Verify isNil functionality', () => {
        expect(ARM.isNil(null)).toBe(true)
        expect(ARM.isNil(undefined)).toBe(true)
        expect(ARM.isNil(1)).toBe(false)
        expect(ARM.isNil('Hello world!')).toBe(false)
        expect(ARM.isNil(true)).toBe(false)
        expect(ARM.isNil({})).toBe(false)
        expect(ARM.isNil([])).toBe(false)
      })

      test('Verify isNull functionality', () => {
        expect(ARM.isNull(null)).toBe(true)
        expect(ARM.isNull(undefined)).toBe(false)
        expect(ARM.isNull(1)).toBe(false)
        expect(ARM.isNull('Hello world!')).toBe(false)
        expect(ARM.isNull(true)).toBe(false)
        expect(ARM.isNull({})).toBe(false)
        expect(ARM.isNull([])).toBe(false)
      })

      test('Verify isGte functionality', () => {
        expect(ARM.isGte(1, 0)).toBe(true)
        expect(ARM.isGte(1, 1)).toBe(true)
        expect(ARM.isGte(0, 1)).toBe(false)
      })

      test('Verify isGt functionality', () => {
        expect(ARM.isGt(1, 0)).toBe(true)
        expect(ARM.isGt(1, 1)).toBe(false)
        expect(ARM.isGt(0, 1)).toBe(false)
      })

      test('Verify isLte functionality', () => {
        expect(ARM.isLte(0, 1)).toBe(true)
        expect(ARM.isLte(1, 0)).toBe(false)
        expect(ARM.isLte(1, 1)).toBe(true)
      })

      test('Verify isLt functionality', () => {
        expect(ARM.isLt(0, 1)).toBe(true)
        expect(ARM.isLt(1, 0)).toBe(false)
        expect(ARM.isLt(1, 1)).toBe(false)
      })
    })
  })
}

export default execUtilsTest
