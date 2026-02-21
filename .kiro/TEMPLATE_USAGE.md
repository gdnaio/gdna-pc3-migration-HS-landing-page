# Using the g/d/n/a Standards Template

This template provides a complete g/d/n/a development standards configuration for new projects.

## Quick Start

### Method 1: Automated Setup (Recommended)

```bash
# Run the setup script
bash .kiro/scripts/setup-template.sh
```

The script will prompt you for:
- Project name
- Project description
- Primary technology
- Cloud provider
- Team name

It will automatically customize `product.md` and `README.md` for you.

### Method 2: Manual Setup

1. **Update Product Overview** (`.kiro/steering/product.md`)
   - Replace placeholder text with your product description
   - Define core features
   - Describe current and target state
   - Define user personas

2. **Update Technology Stack** (`.kiro/steering/tech.md`)
   - List your infrastructure components
   - Document backend and frontend technologies
   - Add common commands
   - List required environment variables

3. **Update Project Structure** (`.kiro/steering/structure.md`)
   - Document your directory layout
   - Describe component/module organization
   - Define naming conventions
   - Document data models

4. **Update README.md**
   - Add project-specific information
   - Update getting started instructions
   - Add team information

## What's Included

### Always-Active Standards (10 files)

These enforce g/d/n/a standards automatically:

1. `nextjs-react-standards.md` - Next.js 14+ App Router
2. `component-library.md` - shadcn/ui + Radix UI
3. `typescript-standards.md` - TypeScript strict mode
4. `state-management.md` - Zustand + TanStack Query
5. `python-standards.md` - FastAPI + pytest
6. `aws-cdk-standards.md` - CDK L2/L3 constructs
7. `testing-standards.md` - Vitest + RTL + Playwright
8. `git-standards.md` - Conventional commits
9. `security-standards.md` - Auth.js + secrets management
10. `grc-compliance.md` - Data classification + audit logging

### Project Templates (3 files)

Customize these for your project:

1. `product.md` - Product overview
2. `structure.md` - Project structure
3. `tech.md` - Technology stack

### Tools

- `analyze-standards.js` - Compliance checker
- `setup-template.sh` - Automated setup script

## Running Standards Analysis

After setup, check your project's compliance:

```bash
# Console output
node .kiro/scripts/analyze-standards.js

# Save to file
node .kiro/scripts/analyze-standards.js --output COMPLIANCE_REPORT.md

# JSON format
node .kiro/scripts/analyze-standards.js --format json --output report.json
```

## Documenting Exceptions

If your project deviates from g/d/n/a standards, document it in your project's steering files.

Example in `tech.md`:

```markdown
## Approved Exceptions

1. **Using Serverless Framework instead of CDK**
   - Reason: Existing infrastructure, team expertise
   - Approved by: [Name], [Date]

2. **Jest instead of Vitest**
   - Reason: Node.js backend project, Jest is acceptable
   - Approved by: [Name], [Date]
```

## Adding Custom Standards

Create new files in `.kiro/steering/`:

```yaml
---
title: Client-Specific Standards
inclusion: always
---

# Client Requirements

[Your custom standards here]
```

## Adding Automation Hooks

Create hooks in `.kiro/hooks/` for automated workflows:

```json
{
  "name": "Lint on Save",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Run linter and fix any errors"
  }
}
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run Standards Analysis
  run: node .kiro/scripts/analyze-standards.js --output standards-report.md

- name: Upload Report
  uses: actions/upload-artifact@v3
  with:
    name: standards-report
    path: standards-report.md

- name: Fail on Critical Issues
  run: |
    if grep -q "CRITICAL" standards-report.md; then
      echo "Critical standards violations found"
      exit 1
    fi
```

## Support

- **Internal**: Contact g/d/n/a engineering team
- **Standards Updates**: Submit PR to template repository
- **Issues**: Open issue in template repository

## Next Steps

1. ✅ Run setup script or manually customize template files
2. ✅ Run standards analysis
3. ✅ Address any critical findings
4. ✅ Start building your project!

---

*g/d/n/a — global digital needs agency*
