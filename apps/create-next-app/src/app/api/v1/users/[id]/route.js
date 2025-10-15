/**
 * GET /api/v1/users/:id
 */
import users from '@/data/users'

export async function GET(request) {
  return Response.json(
    { data: users[0] },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
