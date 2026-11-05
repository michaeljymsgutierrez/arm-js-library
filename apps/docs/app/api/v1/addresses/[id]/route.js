import addresses from '@/data/addresses'
import users from '@/data/users'

/**
 * GET /api/v1/addresses/:id
 */
export async function GET(request, { params }) {
  const { id } = await params
  const address = addresses.find((address) => address.id === Number(id))
  const responsePayload = { data: address ?? null }

  if (request.nextUrl.searchParams.get('include') === 'user')
    responsePayload.included = [users[0]]

  return Response.json(responsePayload, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * PUT /api/v1/addresses/:id
 */
export async function PUT(request, { params }) {
  const { id } = await params
  const address = addresses.find((address) => address.id === Number(id))

  return Response.json(
    { data: address ?? addresses[0] },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

/**
 * DELETE /api/v1/addresses/:id
 */
export async function DELETE(request, { params }) {
  const { id } = await params
  const address = addresses.find((address) => address.id === Number(id))

  return Response.json(
    { data: address ?? addresses[0] },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
