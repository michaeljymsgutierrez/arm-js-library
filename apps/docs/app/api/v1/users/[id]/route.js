import users from '@/data/users'
import addresses from '@/data/addresses'

/**
 * GET /api/v1/users/:id
 */
export async function GET(request, { params }) {
  const { id } = await params
  const user = users.find((user) => user.id === Number(id))
  const responsePayload = { data: user ?? null }

  if (request.nextUrl.searchParams.get('include') === 'addresses')
    responsePayload.included = addresses

  return Response.json(responsePayload, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
