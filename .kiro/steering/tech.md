---
title: Technology Stack
inclusion: always
---

# Technology Stack

## Platform

- HubSpot CMS Hub (Professional or Enterprise)
- HubSpot CLI (`@hubspot/cli`) for local development
- HubSpot Design Manager for preview/QA only

## Templating

- HubL (HubSpot Markup Language)
- HTML5 semantic markup
- CSS3 (no preprocessor — HubSpot handles bundling)
- Vanilla JS (minimal — defer/async, no heavy frameworks)

## Key Tools

- `@hubspot/cli` — Local dev, upload, watch, sandbox
- HubSpot Sandbox — Preview and staging environments
- HubSpot Forms API — Lead capture and workflow triggers
- HubSpot CRM — Contact/deal pipeline for partner migration tracking

## Common Commands

```bash
pnpm dlx hs upload src/theme theme    # Upload to portal
pnpm dlx hs watch src/theme theme     # Watch + auto-upload
pnpm dlx hs fetch theme src/theme     # Pull from portal
pnpm dlx hs create module src/theme/modules/[name]  # New module
```

## Environment Configuration

Portal IDs (set in `hubspot.config.yml` — never committed):
- Dev sandbox: [portal-id]
- Staging: [portal-id]
- Production: [portal-id]

## Deployment Flow

1. Local development with `hs watch` → dev sandbox
2. Upload to staging portal for stakeholder review
3. Marketing approves content and layout
4. Upload to production portal for go-live
5. Post-launch: A/B test variants, monitor conversion metrics

## Integrations

- HubSpot Form → Workflow: Migration onboarding email sequence
- HubSpot Form → CRM: Create deal in partner migration pipeline
- UTM parameters → Hidden form fields for campaign attribution
