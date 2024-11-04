/**
 * @jest-environment jsdom
 */

import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses'])

ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

describe('ARM: Instance initialization', () => {
  test('Verify address collection creation', () => {
    expect(Object.keys(ARM.collections)).toContain('addresses')
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
})
