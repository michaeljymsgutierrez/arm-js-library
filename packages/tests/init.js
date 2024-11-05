import axios from 'axios'

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
        'sailfish-os'
      )
    })
  })
}

export default execInitTest
