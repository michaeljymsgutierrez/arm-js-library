/**
 * @jest-environment jsdom
 */

import axios from 'axios'
import { addresses } from './dummy-data'
import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHeadersCommon('X-Client-Platform', 'sailfish-os')
ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

describe('Instance initialization', () => {
  test('Verify address collection creation', () => {
    expect(ARM.collections).toHaveProperty('addresses')
  })

  test('Verify global ARM instance', () => {
    expect(window.ARM).toBeDefined()
  })

  test('Verify host value', () => {
    expect(ARM.host).toBe('https://api.arm-js-library.com')
  })

  test('Verify namespace value', () => {
    expect(ARM.namespace).toBe('api/v2')
  })

  test('Verify common headers setter', () => {
    expect(axios.defaults.headers.common['X-Client-Platform']).toBe(
      'sailfish-os'
    )
  })
})

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
        office: [{ id: 1, attributes: { kind: 'office', label: 'My Office' } }],
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
  })
})
