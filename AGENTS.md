# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 14 app built with the App Router. Primary code lives in:
- `app/` for routes and page-level UI such as `app/page.js`, `app/dashboard/page.js`, and shared layout files.
- `components/` for reusable UI, forms, and feature blocks. Subfolders like `components/forms/` and `components/ui/` group related pieces.
- `lib/` for utility helpers and API wrappers.
- `store/` for Zustand state, currently `store/resumeStore.js`.
- Static or generated assets are not centralized in this repo; add them under `public/` if needed.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local development server on `http://localhost:3000`.
- `npm run build`: create a production build and catch compile-time issues.
- `npm start`: run the production build locally.
- `npm run lint`: run ESLint using the Next.js core web vitals rules.

## Coding Style & Naming Conventions
Use standard JavaScript/React patterns with 2-space indentation and semicolon-free style, matching the existing codebase. Prefer functional components and keep page files in `app/` as `page.js`. Use PascalCase for components such as `ResumePreview.js` and `JobDescriptionForm.js`, and camelCase for helpers, hooks, and store fields. Keep Tailwind class lists readable by grouping layout, spacing, and color classes consistently.

## Testing Guidelines
The repository does not currently include an automated test framework. Before submitting changes, run `npm run lint` and `npm run build` to verify code quality and production readiness. If you add tests, colocate them near the code they cover and use descriptive names that match the feature or component under test.

## Commit & Pull Request Guidelines
Git history uses conventional-style prefixes such as `feat:` and `docs:`. Keep commit messages short, imperative, and scoped to one change. Pull requests should include a brief summary, list of key changes, and any setup notes. Attach screenshots or short recordings for UI changes, and mention any environment updates required from `.env.example`.

## Security & Configuration Tips
Copy `.env.example` to your local environment file before running the app. Do not commit secrets or API keys. Review `SETUP.md` and `PROJECT_STATUS.md` when making changes that affect configuration or deployment behavior.
