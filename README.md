# Partner Central 3.0 Migration Landing Page

HubSpot CMS landing page driving partner adoption of Partner Central 3.0. Built with g/d/n/a AIDLC standards using the [HubSpot Kiro Standards Template](https://github.com/gdnaio/gdna-hubspot-kiro-standards-template).

## What This Is

A conversion-focused landing page that:
- Communicates the value of migrating to PC3
- Shows a feature comparison (old vs new)
- Walks partners through the migration process
- Captures leads via HubSpot form → onboarding workflow
- Tracks conversions with UTM attribution

## Quick Start

```bash
pnpm install
pnpm dlx hs init                          # Auth with your portal
pnpm dlx hs watch src/theme theme          # Dev with auto-upload
```

## Deployment

```bash
pnpm dlx hs upload src/theme theme --portal=dev      # Dev sandbox
pnpm dlx hs upload src/theme theme --portal=staging   # Stakeholder review
pnpm dlx hs upload src/theme theme --portal=prod      # Go live
```

## Specs

The AIDLC spec lives in `.kiro/specs/pc3-landing-page/`:
- `requirements.md` — Functional, content, SEO, design requirements
- `design.md` — Module composition, field design, responsive behavior
- `tasks.md` — Implementation tasks

## Modules

| Module | Purpose |
|--------|---------|
| `hero-banner` | Migration value prop + primary CTA |
| `feature-comparison` | Old PC vs PC3 side-by-side grid |
| `migration-steps` | Visual timeline of migration process |
| `testimonial-carousel` | Early adopter partner quotes |
| `form-section` | HubSpot form for migration signup |
| `faq-accordion` | Common migration questions |
| `cta-section` | Secondary CTA for undecided partners |

---

*g/d/n/a — global digital needs agency*
