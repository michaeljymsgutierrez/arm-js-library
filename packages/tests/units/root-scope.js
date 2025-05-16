const execRootScopeTest = (ARM) => {
  describe('Root Scope functions', () => {
    test('Verify setRootScope functionality', () => {
      ARM.setRootScope('message', 'Hello world!')
      expect(ARM.getRootScope('message')).toBe('Hello world!')

      ARM.setRootScope('message', null)
      expect(ARM.getRootScope('message')).toBeNull()

      ARM.setRootScope('message', undefined)
      expect(ARM.getRootScope('message')).toBeUndefined()

      ARM.setRootScope('info', { name: 'John Doe', age: 30 })
      expect(ARM.getRootScope('info.name')).toBe('John Doe')
      expect(ARM.getRootScope('info.age')).toBe(30)
      expect(ARM.getRootScope('info.status')).toBeUndefined()
    })

    test('Verify getRootScope functionality', () => {
      ARM.setRootScope('anotherMessage', 'Hello world!')
      expect(ARM.getRootScope('anotherMessage')).toBe('Hello world!')

      ARM.setRootScope('anotherInfo', { name: 'John Doe', age: 30 })
      expect(ARM.getRootScope('anotherInfo')).toEqual({
        name: 'John Doe',
        age: 30,
      })
    })
  })
}

export default execRootScopeTest
