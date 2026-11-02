import addresses from '@/data/addresses'

/**
 * GET /api/v1/addresses
 *
 * `filter[id]` returns a single object under `data` rather than an array -
 * matching `queryRecord`'s documented single-object return shape (see
 * DefaultRequestObjectResponse in the API reference). The unfiltered list
 * stays an array, matching `query`/`findAll`.
 */
export async function GET(request) {
  const id = request.nextUrl.searchParams.get('filter[id]')

  if (id) {
    const address = addresses.find((address) => address.id === Number(id))
    return Response.json(
      { data: address ?? null },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return Response.json(
    { data: addresses },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}

/**
 * POST /api/v1/addresses
 */
export async function POST() {
  return Response.json(
    { data: addresses[0] },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
