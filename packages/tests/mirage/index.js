import { createServer } from 'miragejs'
import { Response } from 'miragejs'
import addresses from '../data/addresses'
import users from '../data/users'

export default function () {
  return createServer({
    routes() {
      this.urlPrefix = 'https://api.arm-js-library.com'
      this.namespace = 'api/v1'

      this.get('/addresses', (schema, request) => {
        const { queryParams } = request

        if (queryParams['include'] === 'users')
          return { data: addresses.data, included: users }

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

      this.put('/addresses/:id', (schema, request) => {
        return request.params.id === '2519858'
          ? new Response(422, {}, { errors: ['An error has occured'] })
          : request.requestBody
      })

      this.delete('/addresses/:id', () => {
        return { data: addresses.data[1] }
      })
    },
  })
}
