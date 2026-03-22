# Git Branching Strategy

## Overview
This project follows a **Git Flow** branching strategy for organized development and deployment.

## Branch Structure

### 🌳 Main Branches

#### `main`
- **Purpose**: Production-ready code
- **Protected**: Yes
- **Deployment**: Automatically deploys to production
- **Merge From**: `release/*` and `hotfix/*` branches only
- **Rules**: 
  - No direct commits
  - Requires pull request approval
  - Must pass all CI/CD checks

#### `develop`
- **Purpose**: Integration branch for features
- **Protected**: Yes
- **Deployment**: Automatically deploys to staging environment
- **Merge From**: `feature/*`, `bugfix/*`, and `hotfix/*` branches
- **Rules**: 
  - No direct commits (use feature branches)
  - Requires pull request approval

---

### 🔧 Supporting Branches

#### `feature/*`
- **Purpose**: Develop new features
- **Created From**: `develop`
- **Merged Into**: `develop`
- **Naming**: `feature/<jira-ticket>-<short-description>`
  - Examples: 
    - `feature/JD2CV-101-user-authentication`
    - `feature/JD2CV-202-resume-preview`
    - `feature/add-pdf-export`
- **Lifetime**: Deleted after merge
- **Rules**:
  - One feature per branch
  - Keep commits atomic and descriptive
  - Rebase with `develop` regularly

#### `bugfix/*`
- **Purpose**: Fix bugs in development
- **Created From**: `develop`
- **Merged Into**: `develop`
- **Naming**: `bugfix/<jira-ticket>-<short-description>`
  - Examples: 
    - `bugfix/JD2CV-303-login-validation`
    - `bugfix/fix-resume-download-error`
- **Lifetime**: Deleted after merge

#### `hotfix/*`
- **Purpose**: Emergency fixes for production
- **Created From**: `main`
- **Merged Into**: `main` AND `develop`
- **Naming**: `hotfix/<version>-<short-description>`
  - Examples: 
    - `hotfix/1.0.1-critical-security-patch`
    - `hotfix/1.2.3-pdf-generation-crash`
- **Lifetime**: Deleted after merge
- **Rules**:
  - Must update version number
  - Requires immediate review
  - Must be merged to both `main` and `develop`

#### `release/*`
- **Purpose**: Prepare for production release
- **Created From**: `develop`
- **Merged Into**: `main` AND `develop`
- **Naming**: `release/<version>`
  - Examples: 
    - `release/1.0.0`
    - `release/2.1.0`
- **Lifetime**: Deleted after merge
- **Activities**:
  - Version bumping
  - Final testing
  - Documentation updates
  - Minor bug fixes only

---

## Workflow Examples

### ✨ Adding a New Feature

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/JD2CV-123-user-avatar

# 3. Make changes and commit
git add .
git commit -m "feat: add user avatar dropdown component"

# 4. Push to remote
git push -u origin feature/JD2CV-123-user-avatar

# 5. Create Pull Request to develop
# 6. After approval, merge and delete branch
```

### 🐛 Fixing a Bug

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create bugfix branch
git checkout -b bugfix/JD2CV-456-fix-text-visibility

# 3. Make changes and commit
git add .
git commit -m "fix: resolve text visibility issue on forms"

# 4. Push and create PR
git push -u origin bugfix/JD2CV-456-fix-text-visibility
```

### 🚨 Deploying a Hotfix

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/1.0.1-pdf-crash-fix

# 3. Make changes and commit
git add .
git commit -m "hotfix: resolve PDF generation crash on large resumes"

# 4. Update version in package.json
npm version patch

# 5. Merge to main
git checkout main
git merge hotfix/1.0.1-pdf-crash-fix
git push origin main

# 6. Merge to develop
git checkout develop
git merge hotfix/1.0.1-pdf-crash-fix
git push origin develop

# 7. Delete hotfix branch
git branch -d hotfix/1.0.1-pdf-crash-fix
```

### 📦 Creating a Release

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/1.0.0

# 3. Update version and documentation
npm version minor
# Update CHANGELOG.md

# 4. Commit release preparation
git commit -am "chore: prepare release 1.0.0"

# 5. Merge to main
git checkout main
git merge release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 6. Merge back to develop
git checkout develop
git merge release/1.0.0
git push origin develop

# 7. Delete release branch
git branch -d release/1.0.0
```

---

## Commit Message Convention

Follow **Conventional Commits** specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD configuration changes

### Examples
```bash
feat(auth): add JWT token refresh mechanism
fix(resume): resolve PDF download on Safari
docs(readme): update installation instructions
refactor(components): extract form validation logic
perf(dashboard): optimize resume state management
test(api): add unit tests for resume generation
chore(deps): update Next.js to 14.2.0
ci(github): add automated deployment workflow
```

---

## Pull Request Guidelines

### PR Title
- Follow commit message convention
- Example: `feat: add user profile dropdown with avatar`

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Dependent changes merged
```

### Review Process
1. **Self-Review**: Review your own PR before requesting review
2. **Automated Checks**: Must pass linting, tests, and build
3. **Peer Review**: At least 1 approval required
4. **Merge**: Use "Squash and merge" for feature branches

---

## Branch Protection Rules

### `main` Branch
- Require pull request before merging
- Require 2 approvals
- Require status checks to pass
- Require branches to be up to date
- No force push
- No deletions

### `develop` Branch
- Require pull request before merging
- Require 1 approval
- Require status checks to pass
- No force push
- No deletions

---

## Version Numbering

Follow **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (v1.x.x → v2.0.0)
- **MINOR**: New features, backward compatible (v1.0.x → v1.1.0)
- **PATCH**: Bug fixes, backward compatible (v1.0.0 → v1.0.1)

### Examples
- `1.0.0` - Initial release
- `1.1.0` - Added AI resume editing feature
- `1.1.1` - Fixed PDF download bug
- `2.0.0` - Redesigned UI (breaking change)

---

## Best Practices

### ✅ Do's
- Keep commits small and focused
- Write descriptive commit messages
- Rebase feature branches with develop regularly
- Delete branches after merging
- Tag releases with version numbers
- Update CHANGELOG.md with each release
- Run tests before pushing
- Keep feature branches short-lived (< 1 week)

### ❌ Don'ts
- Don't commit directly to `main` or `develop`
- Don't commit commented-out code
- Don't commit debugging code (`console.log`, etc.)
- Don't commit credentials or sensitive data
- Don't use generic commit messages ("fix bug", "update")
- Don't create feature branches from other feature branches
- Don't force push to shared branches
- Don't let feature branches become stale

---

## CI/CD Integration

### Automated Workflows

#### On Push to `feature/*` or `bugfix/*`
- Run linter
- Run unit tests
- Build application
- Deploy to preview environment

#### On PR to `develop`
- Run all tests
- Check code coverage (min 80%)
- Build application
- Deploy to staging

#### On Merge to `develop`
- Deploy to staging environment
- Run integration tests
- Update staging documentation

#### On Merge to `main`
- Deploy to production
- Create release notes
- Send deployment notification
- Update production documentation

---

## Tools & Commands

### Useful Git Commands

```bash
# Check branch structure
git log --oneline --graph --all --decorate

# Clean up merged branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Update all branches
git fetch --all --prune

# Cherry-pick a commit
git cherry-pick <commit-hash>

# Stash changes
git stash save "work in progress"
git stash pop

# Interactive rebase (clean up commits)
git rebase -i HEAD~3
```

### Recommended Tools
- **GitKraken**: Visual Git client
- **GitHub Desktop**: Simple Git GUI
- **Husky**: Git hooks automation
- **Commitizen**: Conventional commit helper
- **Semantic Release**: Automated versioning

---

## Emergency Procedures

### Reverting a Bad Commit on `main`

```bash
# Option 1: Revert (creates new commit)
git revert <commit-hash>
git push origin main

# Option 2: Reset (use with caution)
git reset --hard <good-commit-hash>
git push --force origin main  # Only in emergencies!
```

### Recovering a Deleted Branch

```bash
# Find the commit
git reflog

# Recreate branch
git checkout -b <branch-name> <commit-hash>
```

---

## Summary

| Branch | Purpose | Source | Target | Lifetime |
|--------|---------|--------|--------|----------|
| `main` | Production | - | - | Permanent |
| `develop` | Integration | `main` | `main` | Permanent |
| `feature/*` | New features | `develop` | `develop` | Temporary |
| `bugfix/*` | Development bugs | `develop` | `develop` | Temporary |
| `hotfix/*` | Production bugs | `main` | `main` + `develop` | Temporary |
| `release/*` | Release prep | `develop` | `main` + `develop` | Temporary |

---

**Last Updated**: February 24, 2026  
**Version**: 1.0.0
