# Backend Structure Plan

The backend stays in the same Next.js repo for now.

## Route Layout
- `app/api/auth/*`
- `app/api/profile/*`
- `app/api/jobs/*`
- `app/api/resume/*`

## Shared Server Code
- `lib/server/constants.js`
- `lib/server/validators.js`
- `lib/server/api-response.js`

## Future Additions
- `db/` or `prisma/` for database schema and access
- `types/` if shared contracts become large
- `tests/` for API route tests
