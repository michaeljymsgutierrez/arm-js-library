/**
 * GET /api/v1/addresses
 */
import addresses from '@/data/addresses'

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('filter[id]')

  if (id) {
    return Response.json(
      { data: addresses.filter((address) => address.id === Number(id)) },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return Response.json(
    { data: addresses },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * POST /api/v1/addresses
 */
export async function POST(request) {
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
