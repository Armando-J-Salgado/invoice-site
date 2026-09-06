# Invoice Pages Decisions

## 1. Minimal-Tap Invoice Elaboration
- Cashier completes a transaction in under 5 taps:
  1. Toggle Contado / Factura
  2. Pick payment method
  3. Open bottom sheet and tap product items
  4. (Optional) Select Customer
  5. Hit "Registrar Venta"
- Fixed bottom sticky bar with clear total preview and instant feedback.

## 2. Itemized Voucher View
- `InvoiceDetailPage` displays an electronic receipt format with customer details, itemized breakdown, server-verified totals, and soft-delete/recovery controls.
