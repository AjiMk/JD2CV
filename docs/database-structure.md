# Database Structure Plan

## Core Models
- `User`
- `Profile`
- `Resume`
- `ResumeSection`
- `Template`
- `Skill`
- `UserSkill`
- `EducationEntry`
- `WorkExperienceEntry`
- `ProjectEntry`
- `ProjectSkill`
- `CertificationEntry`
- `Company`
- `JobApplication`
- `ApplicationStageEvent`
- `Country`
- `State`
- `LoginAttempt`
- `PasswordResetToken`

## Shared Concepts
- `AuthProvider` enum with:
  - `credentials`
  - `google`
  - `github`
  - `microsoft`
  - `linkedin`
- `ApplicationStage` enum with:
  - `shortListed`
  - `applied`
  - `rejected`
  - `interview`
- `ResumeSectionType` enum with:
  - `personal`
  - `education`
  - `skills`
  - `projects`
  - `certifications`
- `ResumeStatus` enum with:
  - `draft`
  - `complete`

## Design Notes
- Keep auth metadata on `User`.
- Use `LoginAttempt` and `PasswordResetToken` for throttling and password recovery.
- Store country/state as reusable lookup tables and reference them from profile, education, work experience, and job applications.
- Keep `Company` and `Skill` as shared lookup tables.
- Keep project technologies as skill relations, not a separate technology catalog.
- Keep degree and field as text for now to avoid unnecessary lookup tables.
- Use `manualCompanyName` only when `companyId` is unavailable.
- Add `createdAt` and `updatedAt` to every table for auditability and consistent sync behavior.

## Next Steps
- review this design
- create migrations after approval
- wire route handlers to the final schema
