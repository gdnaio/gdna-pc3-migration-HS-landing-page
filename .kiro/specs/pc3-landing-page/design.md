# PC3 Migration Landing Page — Design

## Page Template

- Template: `templates/pages/pc3-migration.html`
- Layout: `templates/layouts/base.html`

## Module Composition (Top to Bottom)

1. `hero-banner` — Full-width hero with migration headline, subheadline, "Start Your Migration" CTA, optional background image/gradient
2. `feature-comparison` — 2-column comparison grid: "Partner Central (Current)" vs "Partner Central 3.0", 4-6 rows
3. `migration-steps` — Horizontal timeline (desktop) / vertical (mobile) showing 3-5 migration steps with icons
4. `testimonial-carousel` — Rotating partner quotes with name, title, company, optional logo
5. `form-section` — HubSpot form embed with heading ("Ready to Migrate?"), description, privacy note, UTM hidden fields
6. `faq-accordion` — 6-8 expandable Q&A pairs about the migration
7. `cta-section` — Final CTA: "Not ready yet? Talk to your partner manager" with secondary button style

## Module Field Design

### hero-banner
- `heading` (text, required): "Upgrade to Partner Central 3.0"
- `subheading` (richtext): Value prop paragraph
- `primary_cta` (link): "Start Your Migration"
- `background_image` (image, optional)
- `style` (choice): light / dark / brand

### feature-comparison
- `heading` (text): "What's New"
- `features` (repeater): each has `feature_name`, `old_value`, `new_value`, `is_new` (boolean)

### migration-steps
- `heading` (text): "How Migration Works"
- `steps` (repeater): each has `step_number`, `title`, `description`, `icon`

### testimonial-carousel
- `heading` (text): "Partners Who've Already Migrated"
- `testimonials` (repeater): each has `quote`, `name`, `title`, `company`, `photo`

### form-section
- `heading` (text): "Ready to Migrate?"
- `description` (richtext)
- `form_id` (text): HubSpot form ID
- `privacy_text` (richtext)

### faq-accordion
- `heading` (text): "Frequently Asked Questions"
- `faqs` (repeater): each has `question`, `answer`

### cta-section
- `heading` (text): "Not Ready Yet?"
- `description` (richtext)
- `cta` (link): "Talk to Your Partner Manager"
- `style` (choice): light / dark / brand

## Responsive Behavior

- Desktop: Full layout, 2-col comparison grid, horizontal timeline
- Tablet (768px): Stack comparison to single column, timeline stays horizontal
- Mobile (480px): Single column everything, vertical timeline, full-width CTAs
