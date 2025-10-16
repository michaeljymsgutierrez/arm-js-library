'use client'

import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return ARM.findRecord(
    // Resource serve as the resource name
    'addresses',
    // Identifier serve as the resource identifier
    123456,
    // Params serve as the request params
    { include: 'user' },
    // Config serve as the request config
    {
      // Skip serve as request go signal to proceed
      // if Request B has dependency on Request A
      /*
      skip: false,
      */

      // Alias serve as identifier for the records obtain from the server.
      // Can be used anywhere in your application through ARM.getAlias('customerAddress')
      alias: 'customerAddress',

      // Auto resolve serve as flag if the request functions will return
      // 1. Promise Function
      //  - To handle success and errors on manual resolve) if autoResolve is set to false
      // 2. Observable/Reactive Data
      //  - To handle success and errors on auto resolve) if autoResolve is set to true
      // Note: autoResolve is only available on query, queryRecord, findAll, findRecord functions.
      // By default autoResolve is set to true.
      autoResolve: true,

      // Ignore payload serve as list of keys to be omitted on request payload.
      /*
      ignorePayload: ['attributes.address2', 'attributes.address1'],
      */

      // Override serve as request override for the default configuration of axios current request.
      // Currently support host, namespace, path and headers for the meantime.
      // Example:
      // Before override: https://www.test-demo.com/api/v1/users/1
      // After override: https://www.another-test-demo.com/api/v2/update-users/1
      /*
      override: {
        host: 'https://www.another-test-demo.com',
        namespace: 'api/v2',
        path: `management-users/${user.get('id')}`,
        headers: {
          'X-Client-Platform': 'Symbian',
        },
      },
      */
    }
  )
}

export default Model
