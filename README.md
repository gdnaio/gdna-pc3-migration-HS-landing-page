# g/d/n/a AIDLC Kiro Standards Template

This repository contains the g/d/n/a development standards configuration for AI-Driven Development Lifecycle (AIDLC) projects using Kiro IDE.

## What's Included

### Steering Documents (16 files)

**g/d/n/a Universal Standards (13 files)** - Always active:
- `frontend-architecture.md` - **NEW**: Vite vs Next.js decision tree, universal patterns
- `architecture.md` - System design patterns (customize per project)
- `coding-standards.md` - Core philosophy and error handling
- `component-library.md` - shadcn/ui + Radix UI standards
- `typescript-standards.md` - TypeScript strict mode and patterns
- `python-standards.md` - FastAPI, pytest, type hints
- `aws-cdk-standards.md` - CDK L2/L3 constructs, testing
- `testing-standards.md` - Vitest, RTL, Playwright
- `git-standards.md` - Conventional commits, branch strategy
- `security-standards.md` - Auth.js, secrets, validation
- `grc-compliance.md` - Data classification, audit logging, WCAG
- `agentic-ai-standards.md` - **NEW**: Bedrock agents, guardrails, evaluation
- `aws-cli-standards.md` - **NEW**: CLI best practices, session management
- `docker-standards.md` - **NEW**: Multi-stage builds, security, optimization
- `performance-standards.md` - **NEW**: Core Web Vitals, bundle budgets
- `team-conventions.md` - **NEW**: Git workflow, sprint cadence, DoD
- `mcp-standards.md` - **NEW**: Model Context Protocol configuration
- `ip-boundaries.md` - **NEW**: Platform vs customer IP guidelines

**Legacy Standards (kept for compatibility)**:
- `nextjs-react-standards.md` - Superseded by `frontend-architecture.md`
- `state-management.md` - Now covered in `frontend-architecture.md`

**Project Templates (3 files)** - Customize for your project:
- `product.md` - Product overview and personas
- `structure.md` - Project structure and patterns
- `tech.md` - Technology stack and configuration

### Hooks (20 files)

Automated quality gates that run on file save, commit, or other triggers:
- `accessibility-audit.kiro.hook` - WCAG compliance checking
- `agent-config-validate.kiro.hook` - Bedrock agent configuration validation
- `agent-evaluation.kiro.hook` - AI agent performance evaluation
- `api-schema-validation.kiro.hook` - OpenAPI schema validation
- `auto-test-on-save.kiro.hook` - Run tests on file save
- `bundle-size-check.kiro.hook` - Enforce bundle size budgets
- `cdk-synth-validate.kiro.hook` - CDK synthesis validation
- `code-coverage-analysis.kiro.hook` - Coverage threshold enforcement
- `commit-message-helper.kiro.hook` - Conventional commit validation
- `dependency-update-check.kiro.hook` - Outdated dependency alerts
- `docker-validate.kiro.hook` - Dockerfile best practices
- `documentation-sync.kiro.hook` - Keep docs in sync with code
- `env-file-validation.kiro.hook` - Environment variable validation
- `grc-compliance-audit.kiro.hook` - GRC compliance checking
- `lint-format-on-save.kiro.hook` - Auto-format on save
- `mcp-config-validate.kiro.hook` - MCP server configuration validation
- `performance-profiling.kiro.hook` - Performance regression detection
- `readme-spell-check.kiro.hook` - Documentation spell checking
- `security-scan-deps.kiro.hook` - Dependency vulnerability scanning
- `typescript-strict-check.kiro.hook` - TypeScript strict mode enforcement

### Skills (2 folders)

Reusable capability patterns:
- `aws-bedrock-agent/` - Bedrock agent development patterns
- `security-baseline/` - Security baseline implementation

### Settings

- `mcp.json` - Model Context Protocol server configuration

### Scripts

- `analyze-standards.js` - Automated compliance checker

### Directories

- `.kiro/specs/` - Feature specifications (TEMPLATE.md included)

## Quick Start

### Option 1: Use as Template Repository

1. Click "Use this template" on GitHub
2. Clone your new repository
3. Customize the 3 project template files in `.kiro/steering/`
4. Start building!

### Option 2: Copy to Existing Project

```bash
# In your existing project
cd your-project

# Copy the .kiro directory
curl -L https://github.com/yourusername/gdna-aidlc-kiro-standards-template/archive/main.tar.gz | \
  tar -xz --strip-components=1 gdna-aidlc-kiro-standards-template-main/.kiro

# Customize project-specific files
# Edit .kiro/steering/product.md
# Edit .kiro/steering/structure.md
# Edit .kiro/steering/tech.md

# Restart Kiro to load the configuration
```

### Option 3: Manual Setup

1. Copy the `.kiro` directory to your project
2. Update the 3 project template files with your project details
3. Restart Kiro

## Running Standards Analysis

Check your project's compliance with g/d/n/a standards:

```bash
# Run analysis
node .kiro/scripts/analyze-standards.js

# Save report to file
node .kiro/scripts/analyze-standards.js --output COMPLIANCE_REPORT.md

# Generate JSON report
node .kiro/scripts/analyze-standards.js --format json --output report.json
```

## Customization

### Add Client-Specific Standards

Create new files in `.kiro/steering/`:

```yaml
---
title: [Client Name] Standards
inclusion: always
---

# Client-Specific Requirements
- Custom compliance needs
- Brand guidelines
- Integration patterns
```

### Add Automation Hooks

Create hooks in `.kiro/hooks/` for automated workflows. See [Kiro documentation](https://kiro.dev/docs/hooks) for details.

### Conditional Steering

Make steering files load only when specific files are in context:

```yaml
---
title: Lambda-Specific Standards
inclusion: fileMatch
fileMatchPattern: 'src/handlers/*.js'
---
```

## Stack Decisions

The g/d/n/a standards enforce these technology choices:

### Frontend Architecture Decision

**NEW**: The `frontend-architecture.md` standard introduces a runtime-agnostic approach:

| Choose Vite + React when | Choose Next.js (App Router) when |
|--------------------------|----------------------------------|
| Agentic SaaS, MVPs, internal tools | Enterprise clients, GRC/compliance projects |
| Pure SPA / PWA behavior needed | SEO-driven pages required |
| Static hosting preferred (S3/CloudFront) | Server-side data boundary required (PII control) |
| Fastest build/dev cycle priority | Server Components simplify data architecture |

**Default: Vite + React** unless the project has specific, documented reasons for Next.js.

### Universal Stack (Works in Both Runtimes)

| Layer | Standard | Why |
|-------|----------|-----|
| Language | TypeScript (strict mode) | Type safety across stack |
| Components | shadcn/ui + Radix UI | Accessible, brandable, auditable |
| Styling | Tailwind CSS | Via shadcn/ui theme tokens |
| Client State | Zustand | Pure UI state (~1KB) |
| Server State | TanStack Query | Caching, polling, optimistic updates |
| Form State | react-hook-form + Zod | Local to form component |
| Validation | Zod | Shared schemas via `common/` |
| Routing | React Router (Vite) or App Router (Next.js) | Same structure, different wiring |
| Testing | Vitest + RTL + Playwright | Identical test suite |
| API Contracts | OpenAPI 3.1 + Swagger UI | Every endpoint documented |
| Auth | AWS Cognito | Amplify (Vite) or Auth.js (Next.js) |
| Backend | Python (FastAPI) or Node.js | AWS Lambda preferred |
| Infrastructure | AWS CDK (TypeScript) | L2/L3 constructs |
| CI/CD | GitHub Actions | Automated deployment |

### Backend Compute Hierarchy

1. **AWS Lambda** (default) — Stateless, event-driven
2. **ECS Fargate / App Runner** — Long-running, WebSockets, connection pooling
3. **EC2** (last resort) — Only when containers can't do it

## Key Changes in This Version

### Frontend Architecture Overhaul
- **NEW**: `frontend-architecture.md` replaces framework-specific standards
- Runtime-agnostic patterns work in both Vite and Next.js
- Decision tree for choosing the right runtime
- Universal project structure and component patterns
- Zustand + TanStack Query replaces Redux

### Expanded Standards Coverage
- **Agentic AI**: Bedrock agents, guardrails, evaluation (`agentic-ai-standards.md`)
- **Performance**: Core Web Vitals, bundle budgets (`performance-standards.md`)
- **Team Workflow**: Sprint cadence, DoD, escalation (`team-conventions.md`)
- **Docker**: Multi-stage builds, security (`docker-standards.md`)
- **AWS CLI**: Best practices, session management (`aws-cli-standards.md`)
- **MCP**: Model Context Protocol configuration (`mcp-standards.md`)
- **IP Boundaries**: Platform vs customer IP (`ip-boundaries.md`)

### Automation & Quality Gates
- 20 pre-configured hooks for automated quality checks
- Skills for Bedrock agents and security baseline
- MCP server configuration template

## Documentation Exceptions

If your project deviates from standards (e.g., using Serverless Framework instead of CDK), document the exception in your project's steering files.

## Support

- **Internal**: Contact g/d/n/a engineering team
- **Standards Updates**: Submit PR to this repository
- **Issues**: Open issue in this repository

## License

Internal use only - g/d/n/a agency

---

*Maintained by g/d/n/a — global digital needs agency*
