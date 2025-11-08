/**
 * GET /api/v1/addresses/:id
 */
import addresses from '@/data/addresses'
import users from '@/data/users'

export async function GET(request, { params }) {
  const id = (await params).id
  const searchParams = request.nextUrl.searchParams
  const filteredAddresses = addresses.filter((address) => address.id == id)
  const responsePayload = { data: filteredAddresses[0] ?? null }

  if (request.nextUrl.searchParams.get('include') === 'user')
    responsePayload.included = [users[0]]

  return Response.json(responsePayload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

/**
 * PUT /api/v1/addresses/:id
 */
export async function PUT(request) {
  return Response.json(
    { data: addresses[0] },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * DELETE /api/v1/addresses/:id
 */
export async function DELETE(request) {
  return Response.json(
    { data: addresses[0] },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
