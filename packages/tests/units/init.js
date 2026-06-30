import axios from 'axios'
import ApiResourceManager from '../../src'

const execInitTest = (ARM) => {
  describe('Instance initialization', () => {
    test('Verify address collection creation', () => {
      expect(ARM.collections).toHaveProperty('addresses')
    })

    test('Verify global ARM instance setter', () => {
      expect(window.ARM).toBeDefined()
    })

    test('Verify host setter', () => {
      expect(ARM.host).toBe('https://api.arm-js-library.com')
    })

    test('Verify namespace setter', () => {
      expect(ARM.namespace).toBe('api/v2')
    })

    test('Verify common headers setter', () => {
      expect(axios.defaults.headers.common['X-Client-Platform']).toBe(
        'sailfish-os',
      )
    })

    test('Verify setPayloadIncludeReference functionality', () => {
      // A fresh instance is needed because the shared ARM is frozen via setGlobal(),
      // which prevents plain (non-observable) properties from being mutated.
      // The constructor calls _initializeAxiosConfig() and resets axios.defaults.baseURL
      // to window.location.origin, so we save and restore it to avoid breaking other tests.
      const originalBaseURL = axios.defaults.baseURL
      const freshARM = new ApiResourceManager(['addresses'])
      freshARM.setPayloadIncludeReference('kind')
      expect(freshARM.payloadIncludedReference).toBe('kind')
      freshARM.setPayloadIncludeReference('type')
      expect(freshARM.payloadIncludedReference).toBe('type')
      axios.defaults.baseURL = originalBaseURL
    })
  })
}

export default execInitTest
