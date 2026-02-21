---
title: Git Standards
inclusion: always
---

# Git Standards

## Conventional Commits

All commits MUST follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes (maintenance, tooling)
- `revert`: Revert a previous commit

### Examples

```bash
# Feature
feat(auth): add Google OAuth integration

# Bug fix
fix(api): handle null response from database query

# Breaking change
feat(api)!: change response format for /users endpoint

BREAKING CHANGE: Response now returns { data: [], meta: {} } instead of []

# Multiple scopes
fix(api,ui): resolve CORS issue affecting frontend requests

# No scope
docs: update README with deployment instructions
```

## Branch Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feature/user-authentication
  │   ├── feature/payment-integration
  │   ├── fix/login-validation
  │   └── refactor/api-error-handling
  └── hotfix/critical-security-patch
```

### Branch Naming

```bash
# Features
feature/user-authentication
feature/add-payment-gateway

# Bug fixes
fix/login-validation-error
fix/memory-leak-in-dashboard

# Refactoring
refactor/extract-api-client
refactor/simplify-auth-flow

# Hotfixes
hotfix/security-vulnerability
hotfix/production-crash
```

## Workflow

### Starting New Work

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat(auth): add user registration endpoint"

# Push to remote
git push origin feature/user-authentication
```

### Pull Request Process

1. Create PR from feature branch to `develop` (or `main` for hotfixes)
2. Fill out PR template with:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Screenshots (if UI changes)
3. Request review from team members
4. Address review comments
5. Squash and merge when approved

### PR Title Format

```
feat(auth): add Google OAuth integration (#123)
fix(api): resolve CORS issue (#124)
docs: update deployment guide (#125)
```

## Commit Best Practices

```bash
# ✅ Good - Atomic commits
git commit -m "feat(auth): add login endpoint"
git commit -m "feat(auth): add logout endpoint"
git commit -m "test(auth): add login endpoint tests"

# ❌ Bad - Monolithic commit
git commit -m "add authentication system with login, logout, and tests"

# ✅ Good - Descriptive subject
git commit -m "fix(api): prevent null pointer exception in user lookup"

# ❌ Bad - Vague subject
git commit -m "fix bug"

# ✅ Good - Present tense
git commit -m "feat(ui): add loading spinner to dashboard"

# ❌ Bad - Past tense
git commit -m "feat(ui): added loading spinner to dashboard"
```

## Commit Message Body

For complex changes, include a body:

```
feat(api): add pagination to products endpoint

- Add limit and offset query parameters
- Return total count in response headers
- Update API documentation
- Add integration tests

Closes #123
```

## Rebase vs Merge

### Use Rebase For

- Keeping feature branch up to date with main
- Cleaning up local commit history before PR

```bash
# Update feature branch with latest main
git checkout feature/user-auth
git fetch origin
git rebase origin/main

# Interactive rebase to clean up commits
git rebase -i HEAD~3
```

### Use Merge For

- Integrating feature branches into main/develop
- Preserving complete history

```bash
# Merge feature into develop
git checkout develop
git merge --no-ff feature/user-auth
```

## Squash and Merge

For PRs, use squash and merge to keep main branch clean:

```bash
# GitHub/GitLab will do this automatically
# Results in single commit on main:
feat(auth): add Google OAuth integration (#123)
```

## Git Hooks

### Pre-commit

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint

# Run type check
npm run type-check

# Run tests
npm run test
```

### Commit-msg

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Validate commit message format
npx commitlint --edit $1
```

## .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Build
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.cache/
.temp/
```

## Protecting Branches

Configure branch protection rules:

- Require pull request reviews (minimum 1)
- Require status checks to pass
- Require branches to be up to date
- Require signed commits (optional)
- Restrict who can push to main

## Handling Conflicts

```bash
# Update your branch
git fetch origin
git rebase origin/main

# If conflicts occur
# 1. Fix conflicts in files
# 2. Stage resolved files
git add .

# 3. Continue rebase
git rebase --continue

# If you need to abort
git rebase --abort
```

## Reverting Changes

```bash
# Revert a commit (creates new commit)
git revert abc123

# Revert multiple commits
git revert abc123..def456

# Reset to previous commit (dangerous!)
git reset --hard HEAD~1

# Undo last commit but keep changes
git reset --soft HEAD~1
```

## Tags and Releases

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to remote
git push origin v1.0.0

# List tags
git tag -l

# Delete tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

## Anti-Patterns

❌ Don't commit directly to main
❌ Don't use `git push --force` on shared branches
❌ Don't commit secrets or credentials
❌ Don't create massive commits with unrelated changes
❌ Don't use vague commit messages
❌ Don't leave commented-out code
❌ Don't commit generated files (build artifacts, dependencies)
