/**
 * @jest-environment jsdom
 */

import axios from 'axios'
import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses'])

ARM.setHeadersCommon('X-Client-Platform', 'sailfish-os')
ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

describe('ARM: Instance initialization', () => {
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
    expect(axios.defaults.headers.common['X-Client-Platform']).toBe('sailfish-os')
  })
})
