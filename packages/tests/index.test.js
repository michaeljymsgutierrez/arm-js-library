/**
 * @jest-environment jsdom
 */

import startMirage from './mirage'
import ApiResourceManager from '../src'
import execInitTest from './units/init'
import execRequestTest from './units/request'
import execRetrieveTest from './units/request'
import execRemoveTest from './units/request'
import execPushTest from './units/request'
import execUtilsTest from './units/utils'

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
execRequestTest(ARM)
execRetrieveTest(ARM)
execRemoveTest(ARM)
execPushTest(ARM)
execUtilsTest(ARM)

afterEach(() => {
  server.shutdown()
})
