/**
 * @jest-environment jsdom
 */

import startMirage from './mirage'
import ApiResourceManager from '../src'
import execInitTest from './units/init'
import execUtilsTest from './units/utils'
import execRequestAndRetrieveTest from './units/request-and-retrieve'

const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHeadersCommon('X-Client-Platform', 'sailfish-os')
ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

let server

beforeEach(() => {
  server = startMirage({ environment: 'test' })
})

execRequestAndRetrieveTest(ARM)
execInitTest(ARM)
execUtilsTest(ARM)

afterEach(() => {
  server.shutdown()
})
