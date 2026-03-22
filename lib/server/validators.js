export function assertExists(value, message = 'Missing required value') {
  if (value === undefined || value === null || value === '') {
    throw new Error(message)
  }
}
