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

    test('Verify _generateHashId functionality', () => {
      const hashId = ARM._generateHashId({ value: 'test' })
      expect(hashId).toBe('91698db377530433476ee39ee73ac62c')
    })

    test('Verify _setProperties functionality', () => {
      let userInfo = { firstName: 'John', lastName: 'Doe' }
      ARM._setProperties(userInfo, { firstName: 'Anna', lastName: 'Wick' })
      expect(userInfo.lastName).toBe('Wick')
      expect(userInfo.firstName).toBe('Anna')
    })

    test('Verify _setRecordProperty functionality', () => {
      let userInfo = {
        firstName: 'John',
        lastName: 'Doe',
      }

      ARM._injectCollectionActions(userInfo)
      userInfo.set('firstName', 'Anna')
      userInfo.set('lastName', 'Wick')

      expect(userInfo.lastName).toBe('Wick')
      expect(userInfo.firstName).toBe('Anna')
    })
  })
}

export default execInternalsTest
