import { killConsole, reviveConsole } from '../helpers'

const execInternalsTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Internal functions', () => {
    test('Verify _initializeCollections functionality', () => {
      ARM._initializeCollections(['shops'])
      expect(ARM.collections.shops).toBeDefined()
    })

    test('Verify _getBaseURL functionality', () => {
      expect(ARM._getBaseURL()).toBe('https://api.arm-js-library.com/api/v2')
    })
  })
}

export default execInternalsTest
