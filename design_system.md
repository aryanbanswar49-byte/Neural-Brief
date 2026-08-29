---
name: Modern Editorial
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  ui-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  article-max-width: 700px
  container-max-width: 1200px
  gutter: 24px
  section-padding-desktop: 80px
  section-padding-mobile: 40px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 32px
---

## Brand & Style
The design system focuses on clarity, readability, and a sophisticated editorial aesthetic. It is tailored for high-quality long-form content, news, and professional blogs where the "reading experience" is the core product. 

The style is rooted in **Minimalism** with an **Editorial** lens. It prioritizes intentional whitespace (breathing room), high-contrast typography, and a restrained color palette. Visual interest is generated through precise typographic scales and layout rhythm rather than decorative effects like gradients or shadows. The goal is to evoke a sense of authority, focus, and modern professionalism.

## Colors
The palette is dominated by neutral tones to allow imagery and content to lead. 

- **Primary Action**: Blue (#2563EB) is used sparingly for links, buttons, and active states to provide a clear signal of interactivity.
- **Surface**: The main content area uses pure white (#FFFFFF), while secondary sections like sidebars or footers use a soft slate gray (#F8FAFC) to create subtle structural separation.
- **Typography**: A tiered gray scale ensures high legibility. The primary text (#0F172A) is nearly black for maximum contrast, while secondary and muted grays handle metadata and less critical information.

## Typography
This design system employs a dual-font strategy to balance modern UI with classical readability.

- **UI & Headlines**: **Plus Jakarta Sans** is used for navigation, buttons, and all heading levels. Its clean, geometric nature provides a modern edge and remains legible at small sizes.
- **Long-form Content**: **Source Serif 4** is utilized for article bodies. It is an authoritative, balanced serif specifically designed for digital reading, reducing eye strain during deep dives.
- **Readability**: Article body text is set at a generous 18px-20px with a 1.6x line-height to ensure an effortless reading flow.

## Layout & Spacing
The layout follows a strict hierarchical grid.

- **The Reading Column**: Central to the design system is a restricted article width of 700px. This prevents line lengths from becoming too long, which preserves reading speed and comprehension.
- **The Container**: Non-article pages (home, category feeds) use a 12-column fluid grid capped at 1200px.
- **Responsive Behavior**: 
  - **Desktop**: Wide margins and 80px vertical section spacing to emphasize the "Minimalist" brand.
  - **Tablet**: Margins shrink to 32px; sidebar content typically stacks below the main column.
  - **Mobile**: Margins shrink to 20px; typography scales down according to the defined mobile tokens.

## Elevation & Depth
In alignment with the editorial aesthetic, depth is communicated through **Tonal Layers** and **Low-contrast Outlines** rather than shadows.

- **Flat Hierarchy**: The UI stays flat on the page. Separation between "Paper" (content) and "Background" (shell) is achieved through a subtle shift from White to Slate-50 (#F8FAFC).
- **Borders**: 1px solid borders in #E2E8F0 are the primary tool for defining cards, input fields, and structural dividers. 
- **Interactive States**: Instead of lifting an element with a shadow on hover, use a background color shift or a slight border-color darken to indicate interactivity.

## Shapes
The design system uses a **Soft (0.25rem)** rounding strategy. 

This subtle roundness removes the "harshness" of sharp corners—making the UI feel contemporary and approachable—without leaning into the overly "bubbly" or playful look of higher radius values. This maintains the professional, serious tone required for editorial work. 
- **Small elements** (Checkboxes, Tags): 4px radius.
- **Large elements** (Cards, Featured Images): 8px (rounded-lg) to 12px (rounded-xl) radius.

## Components
- **Buttons**: Solid primary buttons use #2563EB with white text. Secondary buttons use a white background with a #E2E8F0 border and #0F172A text. Padding should be generous (12px 24px) for a premium feel.
- **Chips/Tags**: Small, #F1F5F9 background with #475569 text, using the `ui-label` typography style. No borders.
- **Input Fields**: 1px solid #E2E8F0 border, 4px corner radius. On focus, the border transitions to #2563EB with a 2px outer ring of the same color at 20% opacity.
- **Cards**: Minimal styling. No shadows. Use a 1px border or a simple background fill of #F8FAFC. Ensure 24px-32px of internal padding.
- **Article Lists**: Emphasize the headline and a short excerpt. Use `text_secondary` for the excerpt and metadata (date, read time).
- **Progress Indicator**: A thin 2px-3px primary blue line at the top of the viewport to indicate scroll progress in articles.
