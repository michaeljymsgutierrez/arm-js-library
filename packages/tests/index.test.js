/**
 * @jest-environment jsdom
 */

import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses'])

ARM.setGlobal()

describe('ARM: Instance initialization', () => {
  test('Verify address collection creation', () => {
    expect(Object.keys(ARM.collections)).toContain('addresses')
  })

  test('Verify global ARM instance', () => {
    expect(typeof window.ARM).not.toBeUndefined()
  })
})
