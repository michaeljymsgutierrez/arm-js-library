import { killConsole, reviveConsole } from '../helpers'

const execInternalsTest = (ARM) => {
  killConsole()
  ARM.setNamespace('api/v1')

  describe('Internal functions', () => {
    test('Verify _initializeCollections functionality', () => {
      ARM._initializeCollections(['shops'])
      expect(ARM.collections.shops).toBeDefined()
    })
  })
}

export default execInternalsTest
