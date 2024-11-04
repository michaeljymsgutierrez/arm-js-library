/**
 * @jest-environment jsdom
 */

import ApiResourceManager from '../src'

const ARM = new ApiResourceManager(['addresses'])

test('Validate creation of address collection', () => {
  console.log(window.ARM)
  expect(Object.keys(ARM.collections)).toContain('addresses')
})
