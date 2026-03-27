---
title: Project Structure
inclusion: always
---

# Project Structure

## PC3 Landing Page Theme Layout

```
src/
└── theme/
    ├── theme.json
    ├── fields.json                    # Brand tokens (colors, fonts, spacing)
    ├── templates/
    │   ├── layouts/
    │   │   └── base.html              # Base layout (header/footer/meta/scripts)
    │   ├── pages/
    │   │   └── pc3-migration.html     # PC3 migration landing page template
    │   ├── system/
    │   │   ├── 404.html
    │   │   └── 500.html
    │   └── partials/
    │       ├── header.html
    │       ├── footer.html
    │       └── navigation.html
    ├── modules/
    │   ├── hero-banner/               # Hero with migration value prop + CTA
    │   ├── feature-comparison/        # Old vs New PC3 comparison grid
    │   ├── migration-steps/           # Timeline / steps visualization
    │   ├── testimonial-carousel/      # Early adopter partner quotes
    │   ├── form-section/              # HubSpot form for migration signup
    │   ├── faq-accordion/             # Migration FAQ
    │   └── cta-section/               # Footer CTA (secondary conversion)
    ├── css/
    │   ├── main.css
    │   └── _variables.css
    ├── js/
    │   └── main.js
    └── images/
```

## PC3-Specific Modules

| Module | Purpose |
|--------|---------|
| `hero-banner` | Migration value prop headline, subheadline, primary CTA |
| `feature-comparison` | Side-by-side old PC vs PC3 feature grid |
| `migration-steps` | Visual timeline showing migration process |
| `testimonial-carousel` | Quotes from partners who migrated early |
| `form-section` | HubSpot form embed for migration signup |
| `faq-accordion` | Common migration questions and answers |
| `cta-section` | Secondary CTA for partners not ready yet |
