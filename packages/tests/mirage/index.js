import { createServer } from 'miragejs'
import addressesJSON from '../data/addresses.json'

export default function () {
  return createServer({
    routes() {
      this.urlPrefix = 'https://api.arm-js-library.com'
      this.namespace = 'api/v1'

      this.get('/addresses', () => {
        return addressesJSON
      })
    },
  })
}
