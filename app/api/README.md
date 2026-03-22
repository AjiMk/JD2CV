# Backend Structure

This directory holds backend route handlers for the Next.js app.

Planned areas:
- `app/api/auth/` for login, registration, logout, and session checks
- `app/api/profile/` for personal details and user profile data
- `app/api/jobs/` for job application CRUD and stage tracking
- `app/api/resume/` for resume generation, preview, and export support

Keep shared request validation, constants, and server helpers in `lib/`.
