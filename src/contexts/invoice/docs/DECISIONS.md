# Invoice Context Decisions

## 1. Integrated Cart & Draft Management
- Stores current invoice elaboration draft directly in Zustand so cashiers do not lose progress if they switch tabs.
- Supports both `CONTADO` (quick walk-in cash sale) and `FACTURA` (with client registration).
- Payment methods: `CASH` (Efectivo), `NEQUI`, `TRANSFER` (Transferencia).

## 2. Server-Calculated Totals
- The backend calculates and validates unit prices and total balances; frontend provides instant reactive subtotal preview for cashier responsiveness.
