import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from './AppShell';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { InvoiceListPage } from '../pages/invoices/InvoiceListPage';
import { InvoiceCreatePage } from '../pages/invoices/InvoiceCreatePage';
import { InvoiceDetailPage } from '../pages/invoices/InvoiceDetailPage';
import { ProductListPage } from '../pages/products/ProductListPage';
import { CustomerListPage } from '../pages/customers/CustomerListPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/invoices" replace />} />
          <Route path="invoices" element={<InvoiceListPage />} />
          <Route path="invoices/new" element={<InvoiceCreatePage />} />
          <Route path="invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="customers" element={<CustomerListPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/invoices" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
