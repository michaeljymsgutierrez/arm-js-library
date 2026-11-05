import users from '@/data/users'

/**
 * GET /api/v1/users
 */
export async function GET() {
  return Response.json(
    { data: users },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
