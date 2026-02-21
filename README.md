# g/d/n/a AIDLC Kiro Standards Template

This repository contains the g/d/n/a development standards configuration for AI-Driven Development Lifecycle (AIDLC) projects using Kiro IDE.

## What's Included

### Steering Documents (13 files)

**g/d/n/a Standards (10 files)** - Always active:
- `nextjs-react-standards.md` - Next.js 14+ App Router patterns
- `component-library.md` - shadcn/ui + Radix UI standards
- `typescript-standards.md` - TypeScript strict mode and patterns
- `state-management.md` - Zustand + TanStack Query
- `python-standards.md` - FastAPI, pytest, type hints
- `aws-cdk-standards.md` - CDK L2/L3 constructs, testing
- `testing-standards.md` - Vitest, RTL, Playwright
- `git-standards.md` - Conventional commits, branch strategy
- `security-standards.md` - Auth.js, secrets, validation
- `grc-compliance.md` - Data classification, audit logging, WCAG

**Project Templates (3 files)** - Customize for your project:
- `product.md` - Product overview and personas
- `structure.md` - Project structure and patterns
- `tech.md` - Technology stack and configuration

### Scripts

- `analyze-standards.js` - Automated compliance checker

### Directories

- `.kiro/specs/` - Feature specifications (empty template)
- `.kiro/hooks/` - Automation hooks (empty template)
- `.kiro/skills/` - Custom skills (empty template)

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

| Layer | Standard |
|-------|----------|
| UI Framework | Next.js 14+ (App Router) |
| Component Library | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Client State | Zustand |
| Server State | TanStack Query |
| Auth | Auth.js (NextAuth.js) |
| Testing | Vitest + RTL + Playwright |
| Backend | Python (FastAPI) or Node.js |
| Infrastructure | AWS CDK (TypeScript) |
| CI/CD | GitHub Actions |

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
