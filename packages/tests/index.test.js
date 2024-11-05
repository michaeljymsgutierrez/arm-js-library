/**
 * @jest-environment jsdom
 */

import ApiResourceManager from '../src'
import execInitTest from './init'
import execUtilsTest from './utils'

const ARM = new ApiResourceManager(['addresses', 'users'])

ARM.setHeadersCommon('X-Client-Platform', 'sailfish-os')
ARM.setHost('https://api.arm-js-library.com')
ARM.setNamespace('api/v2')
ARM.setGlobal()

execInitTest(ARM)
execUtilsTest(ARM)
