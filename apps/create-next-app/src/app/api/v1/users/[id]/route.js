/**
 * GET /api/v1/users/:id
 */
import users from '@/data/users'
import addresses from '@/data/addresses'

export async function GET(request) {
  const responsePayload = { data: users[0] }

  if (request.nextUrl.searchParams.get('include') === 'addresses')
    responsePayload.included = addresses

  return Response.json(responsePayload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
