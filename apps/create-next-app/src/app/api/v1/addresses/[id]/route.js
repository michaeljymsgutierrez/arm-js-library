/**
 * GET /api/v1/addresses/:id
 */
import addresses from '@/data/addresses'

export async function GET(request) {
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
