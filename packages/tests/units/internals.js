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
      let user = { firstName: 'John', lastName: 'Doe' }
      ARM._setProperties(user, { firstName: 'Anna', lastName: 'Wick' })
      expect(user.lastName).toBe('Wick')
      expect(user.firstName).toBe('Anna')
    })

    test('Verify _injectCollectionActions functionality', () => {
      let user = { firstName: 'John', lastName: 'Doe' }
      ARM._injectCollectionActions(user)

      expect(user).toHaveProperty('get')
      expect(user).toHaveProperty('set')
      expect(user).toHaveProperty('setProperties')
      expect(user).toHaveProperty('getARMContext')
      expect(user).toHaveProperty('destroyRecord')
      expect(user).toHaveProperty('save')
      expect(user).toHaveProperty('reload')
      expect(user).toHaveProperty('getCollection')
    })

    test('Verify _injectCollectionReferenceKeys functionality', () => {
      let user = { firstName: 'John', lastName: 'Doe' }
      ARM._injectCollectionReferenceKeys('user', user)

      expect(user).toHaveProperty('collectionName')
      expect(user).toHaveProperty('hashId')
      expect(user).toHaveProperty('isLoading')
      expect(user).toHaveProperty('isError')
      expect(user).toHaveProperty('isPristine')
      expect(user).toHaveProperty('isDirty')
      expect(user).toHaveProperty('originalRecord')
    })
  })
}

export default execInternalsTest
