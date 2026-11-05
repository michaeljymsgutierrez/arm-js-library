/**
 * GET /api/v1
 */
export async function GET() {
  return Response.json(
    { data: { message: 'Hello World!' } },
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
