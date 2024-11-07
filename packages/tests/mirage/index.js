import { createServer } from 'miragejs'
import addresses from '../data/addresses'

export default function () {
  return createServer({
    routes() {
      this.urlPrefix = 'https://api.arm-js-library.com'
      this.namespace = 'api/v1'

      this.get('/addresses', (schema, request) => {
        const { queryParams } = request

        if (queryParams['filter[id]'] === '2519858')
          return { data: addresses.data[0] }

        if (queryParams['page[size]'] === '5')
          return {
            data: [
              addresses.data[0],
              addresses.data[1],
              addresses.data[2],
              addresses.data[3],
              addresses.data[4],
            ],
          }

        return addresses
      })

      this.get('/addresses/:id', () => {
        return { data: addresses.data[1] }
      })
    },
  })
}
