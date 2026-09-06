# Invoice Site — Frontend Implementation Plan

> **Bakery transaction-registration app**  
> Stack: Vite · React 19 · TypeScript · **Tailwind CSS v4** · React Router v7 · Zustand · Plain fetch hooks · React Hook Form · Lucide React · date-fns

---

## 1. Background & Goals

The bakery owner needs a **mobile-first web app** to quickly register sales transactions.  
The critical flow is: **Login → Create Invoice → Done** — this path must require the fewest possible taps.  
Secondary flows (product/variant/customer management) are equally functional but intentionally less prominent.

The backend is a NestJS REST API with JWT auth (`invoice-api`). There is **no payment processing** — only information registration.

---

## 2. Design System Decisions

### 2.1 Theme Token File

Tailwind CSS v4 uses a **CSS-first configuration** approach — there is no `tailwind.config.js`. All design tokens are declared inside the main CSS entry point using the `@theme` block, which becomes the single source of truth.

```
invoice-site/src/styles/global.css   ← SINGLE source of truth for tokens + Tailwind
```

Changing the entire palette requires editing only the `@theme` block in `global.css`. The initial palette keeps the green brand identity from the design references.

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary:          #4CAF50;
  --color-primary-dark:     #388E3C;
  --color-primary-light:    #81C784;
  --color-surface:          rgba(255,255,255,0.12);
  --color-surface-dark:     rgba(0,0,0,0.35);
  --color-text-primary:     #1A1A2E;
  --color-text-secondary:   #5A5A72;
  --color-text-on-primary:  #FFFFFF;
  --color-error:            #E53935;
  --color-warning:          #FB8C00;
  --color-success:          #4CAF50;
  --color-bg-start:         #1B4332;
  --color-bg-end:           #081C15;

  /* Radius */
  --radius-sm:   8px;
  --radius-md:   16px;
  --radius-lg:   24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-glass: 0 8px 32px rgba(0,0,0,0.18);
  --shadow-card:  0 4px 16px rgba(0,0,0,0.12);

  /* Typography */
  --font-sans: 'Inter', sans-serif;
}
```

All tokens declared in `@theme` are automatically available as Tailwind utility classes (e.g., `bg-primary`, `text-text-primary`, `rounded-md`, `shadow-glass`).

### 2.2 Glassmorphism Style Rules

Glassmorphism is applied via Tailwind utility compositions. A `glass-card` semantic class is defined in `global.css` using `@layer components`:

```css
@layer components {
  .glass-card {
    @apply bg-surface backdrop-blur-[16px] border border-white/20 shadow-glass rounded-lg;
  }
  .glass-sheet {
    @apply bg-surface-dark backdrop-blur-[20px] border border-white/10 shadow-glass;
  }
}
```

- Card/sheet backgrounds: `bg-surface` (`rgba(255,255,255,0.12)`) + `backdrop-blur-[16px]`
- Dark overlay behind modals: `bg-black/55` backdrop
- Border: `border border-white/20`
- App background: `bg-gradient-to-b from-bg-start to-bg-end` so glass panels read clearly

### 2.3 Typography

Google Fonts: **Inter** (weights 400, 500, 600, 700) — loaded via `<link>` in `index.html`.

### 2.4 Icons

**Lucide React** — tree-shakeable, consistent stroke-weight icon set. No other icon library.

---

## 3. Recommended Additional Libraries

| Library | Purpose | Rationale |
|---|---|---|
| `react-router-dom` v7 | Routing | Chosen by user |
| `zustand` | Global state | Chosen by user |
| `tailwindcss` v4 + `@tailwindcss/vite` | Styling | Chosen by user; v4 CSS-first, no config file |
| `react-hook-form` | Form handling | Lightweight, uncontrolled, great TypeScript support |
| `lucide-react` | Icons | Minimal, tree-shakeable |
| `date-fns` | Date formatting/parsing | No external Moment.js-sized dep |

No HTTP library — **plain `fetch` with typed custom hooks** per module.

---

## 4. Architecture: Clean Context Folders

```
invoice-site/src/
├── styles/
│   └── global.css          ← SINGLE source of truth: @import tailwindcss + @theme tokens + @layer components (glass utilities)
│
├── common/
│   ├── components/         ← Button, Input, Modal, BottomSheet, Badge, Spinner, etc.
│   ├── hooks/              ← useLocalStorage, useDebounce, usePagination
│   ├── utils/              ← formatCurrency, formatDate, cn (classname helper)
│   ├── types/              ← shared TS types (PaginatedResponse, ApiError, etc.)
│   └── docs/               ← DECISIONS.md, PLAN.md, SUMMARY.md
│
├── contexts/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── authStore.ts    ← Zustand slice
│   │   ├── useAuth.ts
│   │   ├── api.ts          ← fetch wrappers for /auth/*
│   │   └── docs/           ← DECISIONS.md, PLAN.md, SUMMARY.md
│   │
│   ├── invoices/
│   │   ├── invoiceStore.ts ← Zustand slice (invoice creation draft + list cache)
│   │   ├── useInvoices.ts
│   │   ├── api.ts
│   │   └── docs/
│   │
│   ├── products/
│   │   ├── productStore.ts
│   │   ├── useProducts.ts
│   │   ├── api.ts
│   │   └── docs/
│   │
│   ├── product-variants/
│   │   ├── variantStore.ts
│   │   ├── useVariants.ts
│   │   ├── api.ts
│   │   └── docs/
│   │
│   └── customers/
│       ├── customerStore.ts
│       ├── useCustomers.ts
│       ├── api.ts
│       └── docs/
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── docs/
│   ├── invoices/
│   │   ├── InvoiceListPage.tsx
│   │   ├── InvoiceCreatePage.tsx
│   │   ├── InvoiceDetailPage.tsx
│   │   └── docs/
│   ├── products/
│   │   ├── ProductListPage.tsx
│   │   ├── ProductFormPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── docs/
│   ├── product-variants/
│   │   ├── VariantListPage.tsx
│   │   ├── VariantFormPage.tsx
│   │   └── docs/
│   ├── customers/
│   │   ├── CustomerListPage.tsx
│   │   ├── CustomerFormPage.tsx
│   │   ├── CustomerDetailPage.tsx
│   │   └── docs/
│   └── not-found/
│       └── NotFoundPage.tsx
│
├── router/
│   ├── AppRouter.tsx       ← <Routes> tree
│   ├── ProtectedRoute.tsx  ← JWT guard wrapper
│   └── routes.ts           ← named route constants
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

> **Docs convention:** Every major module/context/page group receives a `docs/` subfolder containing exactly three files:
> - `DECISIONS.md` — architectural and design decisions made for this module
> - `PLAN.md` — the planned tasks and approach for this module
> - `SUMMARY.md` — a post-implementation summary of what was built (to be filled after implementation)

---

## 5. State Management — Zustand Slices

### 5.1 Auth Slice (`authStore.ts`)
```
{ token, user, isAuthenticated }
actions: login, logout, restoreSession
```
- JWT stored in `localStorage`; restored on mount via `useEffect` in `AuthContext`
- Every API call reads `authStore.getState().token` (no React context needed for token access)

### 5.2 Invoice Draft Slice (`invoiceStore.ts`)
```
{
  draft: {
    type: 'CONTADO' | 'FACTURA',
    paymentMethod: PaymentMethod,
    customerId?: number,
    items: { productVariantId, quantity, variantName, price }[]
  },
  invoiceList: Invoice[],
  filters: { startDate, endDate, customerId, type, withDeleted, onlyDeleted }
}
actions: setDraftType, setDraftPayment, setDraftCustomer,
         addItem, removeItem, updateItemQty,
         resetDraft, setInvoiceList, setFilters
```

### 5.3 Product / Variant / Customer Slices
Simple list + selectedItem + loading/error state per module.

---

## 6. Routing Map

| Path | Component | Guard |
|---|---|---|
| `/login` | `LoginPage` | public |
| `/` | redirect → `/invoices` | protected |
| `/invoices` | `InvoiceListPage` | protected |
| `/invoices/new` | `InvoiceCreatePage` | protected |
| `/invoices/:id` | `InvoiceDetailPage` | protected |
| `/products` | `ProductListPage` | protected |
| `/products/new` | `ProductFormPage` | protected |
| `/products/:id` | `ProductDetailPage` | protected |
| `/products/:id/edit` | `ProductFormPage` (edit mode) | protected |
| `/products/:productId/variants` | `VariantListPage` | protected |
| `/products/:productId/variants/new` | `VariantFormPage` | protected |
| `/products/:productId/variants/:id/edit` | `VariantFormPage` (edit) | protected |
| `/customers` | `CustomerListPage` | protected |
| `/customers/new` | `CustomerFormPage` | protected |
| `/customers/:id` | `CustomerDetailPage` | protected |
| `/customers/:id/edit` | `CustomerFormPage` (edit mode) | protected |
| `*` | `NotFoundPage` | public |

`ProtectedRoute` reads `isAuthenticated` from Zustand; redirects to `/login` if false.

---

## 7. Page-by-Page Specification

### 7.1 Login Page (`/login`)

**Layout:** full-screen gradient background, centered glass card.  
**Fields:** email + password (show/hide toggle), Submit button.  
**Behavior:**
- `react-hook-form` with inline validation
- On success: store JWT + user in Zustand + localStorage, navigate to `/invoices`
- On error: inline error banner inside the card

---

### 7.2 Invoice List Page (`/invoices`) ← **Primary landing page**

**Layout:** top header bar (title + hamburger/drawer trigger), sticky filter bar, scrollable invoice card list, FAB `+` button (bottom-right, always visible).

**Filter bar (horizontal scroll, pill-style):**
- Date range picker (start / end — two inline date inputs)
- Type filter (All / CONTADO / FACTURA)
- Customer search autocomplete (uses `/customers?name=`)
- "Show deleted" toggle (reveals soft-deleted with visual indicator)

**Invoice card:**
- Customer name (or "Sin cliente" for CONTADO with no customer)
- Invoice ID, date
- Payment method badge
- Type badge (CONTADO / FACTURA)
- Total amount (right-aligned, prominent)
- Soft-deleted cards shown with a strikethrough/muted overlay

**FAB (`+`):** navigates to `/invoices/new`

**Tap on card:** navigates to `/invoices/:id`

---

### 7.3 Invoice Create Page (`/invoices/new`) ← **Critical flow, minimum taps**

**Goal: create a complete invoice in ≤ 5 interactions on mobile.**

**Layout:** single scrollable page, no multi-step wizard.

**Sections (top to bottom):**

#### Section A — Type & Payment (always visible)
- Two large toggle-button tabs: **CONTADO** | **FACTURA** (default: CONTADO)
- Payment method selector: three large tappable pills — **Efectivo / Nequi / Transferencia**

#### Section B — Customer (conditional)
- Hidden when type = CONTADO
- Appears with animation when FACTURA is selected
- Searchable autocomplete field — fetches `/customers?name=…` as user types
- Inline "Crear cliente" link if no match found (opens CustomerFormPage or inline mini-form in a bottom sheet)

#### Section C — Items (always visible)
- Running list of added items: variant name, qty stepper (−/+), line subtotal, remove (×) button
- "Agregar productos" button → opens **ProductVariantBottomSheet**

#### Section D — Totals
- Auto-computed total (read-only, updates reactively)

#### Submit bar (sticky bottom)
- "Crear factura" primary button — disabled until at least 1 item exists
- On success: navigate to `/invoices/:id` (the newly created invoice detail) and reset draft

**ProductVariantBottomSheet:**
- Full-height slide-up panel
- Top search input
- Results grouped by Product name (accordion or flat list with product name as section header)
- Each variant shows: name, price, qty stepper (default 1)
- "Agregar" button per variant, or tap row to add once
- Variants already in draft show current qty and a checkmark
- Close via drag-down or back button

---

### 7.4 Invoice Detail Page (`/invoices/:id`)

**Layout:** glass card layout, read-only display.

**Sections:**
- Header: Invoice ID, date, type badge, payment method badge
- Customer section (if any): name, phone, email
- Items table: variant name | qty | unit price | subtotal
- Total row
- Metadata: created by (user name), created_at, deleted_at (if soft-deleted)

**Actions (bottom action bar):**
- If active: **"Desactivar"** (soft delete) — confirmation dialog
- If deleted: **"Recuperar"** (recover) + visual "ANULADA" overlay on the card

---

### 7.5 Product List Page (`/products`)

**Layout:** search bar + scrollable list of glass cards (product name, variant count).  
**Per card actions:** tap → ProductDetailPage; swipe-left gesture or kebab menu → soft delete.  
**FAB `+`:** navigate to `/products/new`.  
**Soft-deleted toggle** in header.

---

### 7.6 Product Form Page (`/products/new` and `/products/:id/edit`)

**Fields:** name (required).  
Simple glass card form. On save → navigate to ProductDetailPage.

---

### 7.7 Product Detail Page (`/products/:id`)

Displays product name + list of its variants.  
**Actions:** Edit product, Add variant (→ VariantFormPage), Soft delete product.

---

### 7.8 Variant List Page (`/products/:productId/variants`)

List of variants for a product with name, price, status badges.  
FAB to add new variant.

---

### 7.9 Variant Form Page (`/products/:productId/variants/new` and `…/:id/edit`)

**Fields:** name (required), price (required, decimal stepper or numeric input).  
Simple glass card form.

---

### 7.10 Customer List Page (`/customers`)

Search bar + glass card list (name, phone, email).  
Soft-deleted toggle. FAB to add.

---

### 7.11 Customer Form Page (`/customers/new` and `/:id/edit`)

**Fields:** name (required), address, phoneNumber, email, favoriteProduct (variant autocomplete — optional).

---

### 7.12 Customer Detail Page (`/customers/:id`)

Displays all customer fields, favorite product variant.  
Actions: Edit, Soft delete, Recover (if deleted).

---

## 8. Navigation Shell

**Mobile-first navigation pattern: Side Drawer (hamburger menu)**

- `AppShell` component wraps all protected pages
- Hamburger icon in top-left → slides in a glass side drawer from the left
- Drawer items: Facturas (invoices), Productos, Clientes, (separator), Cerrar sesión
- Drawer closes on navigation or tap outside
- The `+` FAB is always present on list pages (not inside the drawer)

---

## 9. API Layer — Plain Fetch Hooks

Each context folder owns its `api.ts`:

```ts
// Pattern per module
const BASE = import.meta.env.VITE_API_URL;

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function fetchInvoices(params: InvoiceFilters): Promise<Invoice[]> {
  const qs = new URLSearchParams(/* map params */);
  const res = await fetch(`${BASE}/invoices?${qs}`, { headers: authHeaders() });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}
```

Custom hooks (`useInvoices.ts`) manage loading/error state via `useState` + `useEffect` calling the api functions.  
A shared `ApiError` class lives in `common/types/`.  
A `401` response triggers `authStore.logout()` + redirect to `/login`.

---

## 10. Environment Configuration

```
invoice-site/.env.local  (gitignored)
VITE_API_URL=http://localhost:3000
```

---

## 11. Implementation Phases

### Phase 0 — Foundation (do first)
- [ ] Install dependencies: `tailwindcss@next`, `@tailwindcss/vite`, `react-router-dom`, `zustand`, `react-hook-form`, `lucide-react`, `date-fns`
- [ ] Configure `@tailwindcss/vite` plugin in `vite.config.ts`
- [ ] Write `styles/global.css` with `@import "tailwindcss"`, `@theme` block (all tokens), and `@layer components` (`.glass-card`, `.glass-sheet`, `.glass-input`)
- [ ] Add Inter font `<link>` to `index.html`
- [ ] Build `common/components/`: Button, Input, Badge, Spinner, BottomSheet, Modal, ConfirmDialog — all styled with Tailwind utilities
- [ ] Build `common/utils/`: `formatCurrency`, `formatDate`, `cn` (classname helper, e.g. using `clsx`)
- [ ] Set up `router/AppRouter.tsx` with all routes and `ProtectedRoute`
- [ ] Set up `AppShell` with side drawer

### Phase 1 — Auth
- [ ] `contexts/auth/` slice + api
- [ ] `LoginPage`
- [ ] Session restore on mount

### Phase 2 — Critical Flow (Invoice Creation)
- [ ] `contexts/invoices/` slice + api
- [ ] `InvoiceListPage` with FAB
- [ ] `InvoiceCreatePage` with type toggle, payment pills, item list
- [ ] `ProductVariantBottomSheet` with search + grouped list + qty steppers
- [ ] `InvoiceDetailPage` with deactivation / recovery

### Phase 3 — Products & Variants
- [ ] `contexts/products/` + `contexts/product-variants/`
- [ ] `ProductListPage`, `ProductFormPage`, `ProductDetailPage`
- [ ] `VariantListPage`, `VariantFormPage`

### Phase 4 — Customers
- [ ] `contexts/customers/`
- [ ] `CustomerListPage`, `CustomerFormPage`, `CustomerDetailPage`

### Phase 5 — Polish & Filters
- [ ] Invoice list filters (date range, type, customer, deleted toggle)
- [ ] Micro-animations (page transitions, bottom sheet slide, badge pop)
- [ ] Error boundaries, empty states, skeleton loaders
- [ ] Offline/network error handling
- [ ] Responsive tweaks for tablet / desktop breakpoints

---

## 12. Docs Folder Convention (per module)

Every folder listed below **must contain a `docs/` subfolder** with exactly three markdown files:

| File | Content |
|---|---|
| `DECISIONS.md` | Architectural and design decisions specific to this module: why a pattern was chosen, alternatives considered, trade-offs |
| `PLAN.md` | The planned tasks and approach for this module (what was intended to be built) |
| `SUMMARY.md` | Post-implementation summary: what was actually built, deviations from plan, known issues |

**Modules that require a `docs/` folder:**

- `src/common/`
- `src/contexts/auth/`
- `src/contexts/invoices/`
- `src/contexts/products/`
- `src/contexts/product-variants/`
- `src/contexts/customers/`
- `src/pages/auth/`
- `src/pages/invoices/`
- `src/pages/products/`
- `src/pages/product-variants/`
- `src/pages/customers/`
- `src/router/`
- `src/styles/`

---

## 13. Key Design Patterns Applied

| Pattern | Where Applied |
|---|---|
| **Zustand slices** | One store file per domain context; no single god-store |
| **Custom hooks as service layer** | `useInvoices`, `useCustomers`, etc. encapsulate fetch + state |
| **Conditional rendering via Zustand selector** | e.g., customer field only when draft.type === 'FACTURA' |
| **Compound component** | `BottomSheet` = `BottomSheet.Root + BottomSheet.Handle + BottomSheet.Content` |
| **Token-driven theming** | All visual values from `theme.json`, never hardcoded hex in component CSS |
| **Protected Route HOC** | Single `ProtectedRoute` wrapper — no auth logic leaking into pages |
| **ApiError class** | Typed error object from API layer; pages never `catch(e: any)` |

---

## 14. Open Items / Decisions After Plan Approval

1. **Pagination vs. infinite scroll** on list pages — the API does not currently expose pagination. If the list grows large, either add backend pagination or implement client-side virtual scrolling.
2. **Invoice editing** — the API only exposes `POST /invoices` (create) and `DELETE` (soft-delete). There is no `PATCH` endpoint for invoices. Invoice editing is therefore **out of scope**; the detail page is read-only.
3. **User registration** — the API only exposes `POST /auth/login`. There is no signup endpoint. User management is **out of scope** for this frontend.
4. **Print / PDF export** — the design images reference PDF invoices. This is **not planned** in this version but the architecture should not block adding it later.
