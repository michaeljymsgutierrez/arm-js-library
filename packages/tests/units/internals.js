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

    test('Verify _isCollectionExisting functionality', () => {
      ARM._initializeCollections(['shops'])
      expect(() => ARM._isCollectionExisting('shop')).toThrow()
      expect(() => ARM._isCollectionExisting('shops')).not.toThrow()
    })

    test('Verify _addCollection functionality', () => {
      ARM._addCollection('roles', [])
      expect(ARM.collections.roles).toBeDefined()
      expect(ARM.getCollection('roles')).toHaveLength(0)
    })

    test('Verify _addAlias functionality', () => {
      ARM._addAlias('currentRoles', [])
      expect(ARM.aliases.currentRoles).toBeDefined()
      expect(ARM.getAlias('currentRoles')).toHaveLength(0)
    })
  })
}

export default execInternalsTest
