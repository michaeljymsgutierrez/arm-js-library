/**
 * This is an example of a route file.
 * You can delete this file if you don't need it.
 */
export async function GET(request) {
  return Response.json(
    { data: { message: 'Hello World!' } },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
