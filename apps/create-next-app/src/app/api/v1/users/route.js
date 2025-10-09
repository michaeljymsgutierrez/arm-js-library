/**
 * GET /api/v1/users
 */
import users from '@/data/users'

export async function GET(request) {
  return Response.json(
    { data: users },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
