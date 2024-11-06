import { Server } from 'miragejs'

export default function () {
  return new Server({
    routes() {
      this.get('/api/users', () => ({
        users: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
      }))
    },
  })
}
