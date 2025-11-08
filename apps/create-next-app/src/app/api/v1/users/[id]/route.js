/**
 * GET /api/v1/users/:id
 */
import users from '@/data/users'
import addresses from '@/data/addresses'

export async function GET(request) {
  return Response.json(
    { data: users[0], included: addresses },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
