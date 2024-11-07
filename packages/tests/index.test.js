/**
 * @jest-environment jsdom
 */

import startMirage from './mirage'
import ApiResourceManager from '../src'
import execInitTest from './units/init'
import execUtilsTest from './units/utils'
import execRequestAndRetrieveTest from './units/request-and-retrieve'
import execRemoveAndPushTest from './units/remove-and-push'

const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHeadersCommon('X-Client-Platform', 'sailfish-os')
ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

let server

beforeEach(() => {
  server = startMirage({ environment: 'test' })
})

execInitTest(ARM)
execRequestAndRetrieveTest(ARM)
execRemoveAndPushTest(ARM)
execUtilsTest(ARM)

afterEach(() => {
  server.shutdown()
})
