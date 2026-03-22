export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status })
}

export function jsonOk(data, status = 200) {
  return Response.json(data, { status })
}
