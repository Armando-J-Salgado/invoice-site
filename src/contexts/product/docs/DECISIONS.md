# Product Context Decisions

## 1. Split Product and Variant Management
- Products act as categories/parents with just names (e.g. "Pan Francés", "Croissant").
- Variants define actual salable items with price (e.g. "Unidad", "Bolsa x6").
- The store manages both entities while keeping API endpoints cleanly decoupled.
