import { ARM } from '@/components/providers/arm-config-provider'

const Model = () => {
  return ARM.findRecord(
    // resource - also the registered collection name
    'addresses',
    // id - accepts numeric or string IDs
    2519858,
    // params - query string parameters
    { include: 'user' },
    {
      // alias - accessible anywhere via ARM.getAlias('customerAddress')
      alias: 'customerAddress',

      // autoResolve - only affects query/queryRecord/findAll/findRecord;
      // true (default) returns a reactive object, false returns a Promise
      autoResolve: true,

      // ignorePayload: ['attributes.address2'],

      // override: { host: 'https://other-api.example.com', namespace: 'api/v2' },
    },
  )
}

export default Model
