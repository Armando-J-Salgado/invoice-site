# Styles Architecture Decisions

## 1. Tailwind CSS v4 CSS-First Approach
- Replaced the deprecated `tailwind.config.js` with direct `@theme {}` block in `src/styles/global.css`.
- Allows CSS variables to drive design tokens directly.

## 2. Palette & Glassmorphism
- Emerald & Forest Green bakery identity (`#2e7d32`, `#1b5e20`, `#81c784`).
- Dark deep-tinted surfaces (`#0b1e13`, `#102a1c`) allow backdrop blur (`blur(16px)`) and frosted borders to stand out with high contrast.
- Custom reusable glass classes: `.glass-card`, `.glass-sheet`, `.glass-input`, `.glass-button-primary`, `.glass-button-secondary`.
