# Router Architecture Decisions

## 1. Side Drawer Navigation
- Selected side drawer instead of bottom navigation tabs to maximize vertical canvas on small screens when selecting products and building invoices.
- AppShell provides a unified top navigation bar with quick back actions and a persistent "Nueva Venta" CTA.

## 2. Route Guarding
- `ProtectedRoute` inspects client auth state and redirects unauthenticated cashiers to `/login` while preserving location state for seamless post-login return.
