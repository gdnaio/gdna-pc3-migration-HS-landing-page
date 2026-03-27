# Partner Central 3.0 Migration Landing Page

HubSpot CMS landing page driving partner adoption of Partner Central 3.0. Built with g/d/n/a AIDLC standards.

## Setup

```bash
pnpm install
```

Get a HubSpot personal access key from Anvi or Will, then run in your terminal (not Kiro):

```bash
pnpm --package=@hubspot/cli dlx hs auth
```

This creates `hubspot.config.yml` locally (never committed).

## Upload to HubSpot

```bash
# CSS + JS + Templates
pnpm --package=@hubspot/cli dlx hs cms upload src/gdna-pc3-migration/css gdna-pc3-migration/css
pnpm --package=@hubspot/cli dlx hs cms upload src/gdna-pc3-migration/js gdna-pc3-migration/js
pnpm --package=@hubspot/cli dlx hs cms upload src/gdna-pc3-migration/templates gdna-pc3-migration/templates

# Modules
pnpm --package=@hubspot/cli dlx hs cms upload src/gdna-pc3-migration/modules gdna-pc3-migration/modules
```

## Preview

After uploading, go to your HubSpot portal → Marketing → Website → Website Pages → Create page → select "PC3 Migration Landing Page" template → Preview.

## Modules

| Module | Purpose |
|--------|---------|
| `urgency-banner.module` | AWS deadline warning banner |
| `hero-banner.module` | Migration value prop + headline |
| `stats-row.module` | $0 / <30 min / Jun 30 stat cards |
| `pain-points.module` | Why migrations fail + g/d/n/a solution |
| `two-column-features.module` | What we deliver + How it works |
| `highlight-banner.module` | SOC2 compliance add-on |
| `differentiators.module` | Why g/d/n/a over anyone else |
| `cta-section.module` | Final CTA with Get Started button |

## Specs

AIDLC spec in `.kiro/specs/pc3-landing-page/` — requirements, design, tasks.

---

*g/d/n/a — global digital needs agency*
