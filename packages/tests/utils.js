import { addresses } from './dummy-data'

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
        console.log(ARM.isPresent(1))
        expect(ARM.isPresent('Hello world!')).toBe(true)
        expect(ARM.isPresent({ message: 'Hello world!' })).toBe(true)
        expect(ARM.isPresent({})).toBe(false)
        expect(ARM.isPresent([1, 2, 3])).toBe(true)
        expect(ARM.isPresent([])).toBe(false)
      })
    })
  })
}

export default execUtilsTest
