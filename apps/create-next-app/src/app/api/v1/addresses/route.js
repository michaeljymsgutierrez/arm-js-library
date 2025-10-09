/**
 * GET /api/v1/addresses
 */
import addresses from '@/data/addresses'

export async function GET(request) {
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
