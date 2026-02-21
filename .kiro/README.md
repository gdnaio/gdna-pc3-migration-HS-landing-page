# g/d/n/a Development Standards — Kiro Configuration

This `.kiro` configuration enforces g/d/n/a's development standards across all project types. It provides AI steering documents covering our full stack: Next.js/React frontends, Python backend services, AWS CDK infrastructure, and GRC compliance requirements.

## Stack Decisions (Locked)

| Layer | Standard | Rationale |
|-------|----------|-----------|
| **UI Framework** | Next.js 14+ (App Router) | Server Components by default, AWS Amplify hosting alignment |
| **Component Library** | shadcn/ui + Radix UI primitives | Accessible (WCAG 2.1), brandable per client, auditable (copied into project) |
| **Styling** | Tailwind CSS | Consistent with shadcn/ui, utility-first, purged in production |
| **Client State** | Zustand | Minimal API (~1KB), clear separation from server state |
| **Server State** | TanStack Query (React Query) | Caching, polling, optimistic updates for client-side async |
| **Data Fetching** | React Server Components + Server Actions | Default pattern; keeps sensitive data server-side |
| **Auth** | Auth.js (NextAuth.js) | Server-side sessions only; no tokens in localStorage |
| **Testing** | Vitest + React Testing Library + Playwright | Fast unit tests, accessible component tests, e2e coverage |
| **Backend** | Python (FastAPI / Lambda) | AWS Lambda alignment, pytest for testing |
| **Infrastructure** | AWS CDK (TypeScript) | IaC standard, L2/L3 constructs preferred |
| **CI/CD** | GitHub Actions | Pipeline-as-code, AWS credential management via OIDC |

## What's Included

### Steering Documents (10) — Always Active

These guide every AI interaction in your IDE:

| Document | Scope |
|----------|-------|
| `nextjs-react-standards.md` | App Router patterns, RSC defaults, routing conventions |
| `state-management.md` | Zustand for client, TanStack Query for server, when to use each |
| `component-library.md` | shadcn/ui + Radix patterns, accessibility requirements |
| `typescript-standards.md` | Strict mode, naming, Result/Either patterns, Zod validation |
| `python-standards.md` | FastAPI patterns, virtual environments, pytest conventions |
| `aws-cdk-standards.md` | Construct organization, testing, tagging, CDK vs TF decision |
| `testing-standards.md` | Vitest config, RTL patterns, Playwright e2e, coverage gates |
| `git-standards.md` | Conventional commits, branch strategy, PR requirements |
| `security-standards.md` | Auth patterns, secret management, dependency scanning |
| `grc-compliance.md` | Data classification, audit logging, WCAG, SOC 2 alignment |

### Project-Specific Standards (3)

These are specific to this a10dit project:

| Document | Scope |
|----------|-------|
| `product.md` | Product overview, personas, current/target state |
| `structure.md` | Project structure, handler patterns, data models |
| `tech.md` | Technology stack, AWS configuration, common commands |

## How It Works

### Automatic Steering

All steering documents with `inclusion: always` are automatically loaded into Kiro's context for every interaction. This means:

- Kiro knows your stack decisions and won't suggest alternatives
- Code suggestions follow your patterns automatically
- Security and compliance requirements are enforced
- Testing standards are applied to all test code

### Manual Steering

You can reference specific steering files using `#` in chat:
```
#nextjs-react-standards
#security-standards
```

## Customization

### Add Client-Specific Standards

Create a new file in `.kiro/steering/`:

```yaml
---
title: [Client Name] Project Standards
inclusion: always
---

# Client-Specific Requirements
- Custom compliance needs
- Brand guidelines
- Integration patterns
```

### Conditional Steering

Make a steering file load only when specific files are in context:

```yaml
---
title: Lambda-Specific Standards
inclusion: fileMatch
fileMatchPattern: 'src/handlers/*.js'
---

# Lambda Handler Standards
...
```

## GRC Compliance Layer

This configuration includes GRC-specific enforcement:

- **Data Classification** — Components must declare data sensitivity levels
- **Audit Logging** — User action tracking patterns enforced
- **PII Handling** — No PII in client-side storage, enforced via steering
- **CSP Headers** — Content Security Policy templates and validation
- **Access Control** — RBAC patterns for Next.js middleware
- **SOC 2 Alignment** — Development practices mapped to SOC 2 controls

## Project Structure

```
.kiro/
├── README.md                           # This file
├── steering/                           # AI steering documents
│   ├── nextjs-react-standards.md
│   ├── state-management.md
│   ├── component-library.md
│   ├── typescript-standards.md
│   ├── python-standards.md
│   ├── aws-cdk-standards.md
│   ├── testing-standards.md
│   ├── git-standards.md
│   ├── security-standards.md
│   ├── grc-compliance.md
│   ├── product.md                      # Project-specific
│   ├── structure.md                    # Project-specific
│   └── tech.md                         # Project-specific
├── hooks/                              # Automation hooks (empty for now)
├── specs/                              # Feature specifications
└── skills/                             # Custom skills (empty for now)
```

## Usage Examples

### Starting a New Feature

```
"Create a new user profile page following our standards"
```

Kiro will automatically:
- Use Next.js App Router with Server Components
- Apply TypeScript strict mode
- Follow component organization patterns
- Include accessibility attributes
- Use proper authentication checks

### Code Review

```
"Review this code for security issues"
```

Kiro will check against:
- Security standards (input validation, XSS prevention, etc.)
- GRC compliance (PII handling, audit logging)
- Best practices from all steering documents

### Writing Tests

```
"Add tests for this component"
```

Kiro will:
- Use Vitest and React Testing Library
- Follow testing best practices
- Include accessibility tests
- Meet coverage thresholds

## Maintenance

### Updating Standards

1. Edit the relevant `.md` file in `.kiro/steering/`
2. Restart Kiro to reload the configuration
3. Changes apply immediately to all new interactions

### Version Control

All `.kiro` configuration is committed to version control, ensuring:
- Team-wide consistency
- Standards evolution tracking
- Easy rollback if needed

## Support

For questions about these standards:
- Internal: Contact g/d/n/a engineering team
- Standards updates: Submit PR to this repository
- Issues: Open issue in project repository

---

*Maintained by g/d/n/a — global digital needs agency*
