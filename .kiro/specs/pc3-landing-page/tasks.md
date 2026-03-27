# PC3 Migration Landing Page — Tasks

## Task 1: Theme Scaffold
- [ ] Create `src/theme/theme.json` with PC3 metadata
- [ ] Create `src/theme/fields.json` with brand tokens
- [ ] Create `src/theme/templates/layouts/base.html` with standard includes, meta, skip nav
- [ ] Create `src/theme/css/_variables.css` and `main.css`
- [ ] Create `hubspot.config.yml` locally (from .example), auth with dev portal
- [ ] Verify upload to dev sandbox with `hs upload`

## Task 2: Hero Banner Module
- [ ] Create `modules/hero-banner/` (module.html, module.css, module.js, meta.json, fields.json)
- [ ] Fields: heading, subheading, primary_cta, background_image, style
- [ ] Responsive: full-width desktop, stacked mobile
- [ ] Accessibility: semantic h1, alt text, focus-visible CTA

## Task 3: Feature Comparison Module
- [ ] Create `modules/feature-comparison/`
- [ ] Fields: heading, features (repeater with feature_name, old_value, new_value, is_new)
- [ ] 2-column grid with visual differentiation for new features
- [ ] Responsive: 2-col → 1-col stacked

## Task 4: Migration Steps Module
- [ ] Create `modules/migration-steps/`
- [ ] Fields: heading, steps (repeater with step_number, title, description, icon)
- [ ] Horizontal timeline (desktop), vertical (mobile)

## Task 5: Testimonial Carousel Module
- [ ] Create `modules/testimonial-carousel/`
- [ ] Fields: heading, testimonials (repeater with quote, name, title, company, photo)
- [ ] Vanilla JS carousel with prev/next, pause on hover

## Task 6: Form Section Module
- [ ] Create `modules/form-section/`
- [ ] Fields: heading, description, form_id, privacy_text
- [ ] HubSpot form embed, hidden UTM fields
- [ ] Verify form submission triggers workflow

## Task 7: FAQ Accordion Module
- [ ] Create `modules/faq-accordion/`
- [ ] Fields: heading, faqs (repeater with question, answer)
- [ ] Vanilla JS expand/collapse with aria-expanded

## Task 8: CTA Section Module
- [ ] Create `modules/cta-section/`
- [ ] Fields: heading, description, cta, style

## Task 9: PC3 Migration Page Template
- [ ] Create `templates/pages/pc3-migration.html`
- [ ] Compose all modules with `{% dnd_area %}`
- [ ] Include `standard_header_includes` and `standard_footer_includes`

## Task 10: System Templates and Partials
- [ ] Create 404.html, 500.html, header.html, footer.html

## Task 11: QA and Deploy
- [ ] Upload to dev sandbox, verify all modules
- [ ] Test form submission → CRM workflow
- [ ] Test UTM passthrough
- [ ] Test responsive breakpoints
- [ ] Accessibility audit
- [ ] Upload to staging for stakeholder review
- [ ] Upload to production
