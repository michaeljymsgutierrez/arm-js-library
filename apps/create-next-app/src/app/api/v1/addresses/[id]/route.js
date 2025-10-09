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
