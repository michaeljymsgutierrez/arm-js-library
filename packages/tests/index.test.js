import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses'])

test('Validate creation of address collection', () => {
  expect(Object.keys(ARM.collections)).toContain('addresses')
})
