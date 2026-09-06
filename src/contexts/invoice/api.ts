import { apiClient } from '../auth/apiClient';
import type { Invoice, CreateInvoiceDto, InvoiceFilterParams } from './types';

function buildCleanParams(params?: InvoiceFilterParams): Record<string, string | number> {
  const clean: Record<string, string | number> = {};
  if (!params) return clean;

  if (params.startDate) clean.startDate = params.startDate;
  if (params.endDate) clean.endDate = params.endDate;

  // The backend's GET /invoices controller applies @Query('customerId', ParseIntPipe) without { optional: true }.
  // If customerId is completely omitted, NestJS passes `undefined` to ParseIntPipe and throws:
  // "Validation failed (numeric string is expected)" (HTTP 400).
  // Passing 0 satisfies ParseIntPipe. In invoices.service.ts, `if (queryParams.customerId)` evaluates
  // 0 as falsy (Boolean(0) === false), so no WHERE clause is added and all customers are returned.
  clean.customerId = 0;

  if (params.onlyDeleted) clean.onlyDeleted = 'true';
  if (params.withDeleted) clean.withDeleted = 'true';
  if (params.type) clean.type = params.type;

  return clean;
}

export const invoiceApi = {
  getInvoices: async (params?: InvoiceFilterParams): Promise<Invoice[]> => {
    const cleanParams = buildCleanParams(params);

    // If type is explicitly selected, make a single request
    if (cleanParams.type) {
      return apiClient<Invoice[]>('/invoices', { params: cleanParams });
    }

    // When unfiltered by type, the backend's ParseEnumPipe expects a valid InvoiceType enum.
    // Fetch both CONTADO and FACTURA in parallel and merge the sorted results.
    const [contadoList, facturaList] = await Promise.all([
      apiClient<Invoice[]>('/invoices', { params: { ...cleanParams, type: 'CONTADO' } }).catch(() => [] as Invoice[]),
      apiClient<Invoice[]>('/invoices', { params: { ...cleanParams, type: 'FACTURA' } }).catch(() => [] as Invoice[]),
    ]);

    const combined = [...contadoList, ...facturaList];
    // Sort descending by created_at / date / id
    combined.sort((a, b) => {
      const timeA = new Date(a.created_at || a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.created_at || b.createdAt || b.date || 0).getTime();
      return timeB - timeA || b.id - a.id;
    });

    return combined;
  },

  getInvoiceById: async (id: number): Promise<Invoice> => {
    return apiClient<Invoice>(`/invoices/${id}`);
  },

  createInvoice: async (data: CreateInvoiceDto): Promise<Invoice> => {
    return apiClient<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteInvoice: async (id: number): Promise<void> => {
    return apiClient<void>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  recoverInvoice: async (id: number): Promise<void> => {
    return apiClient<void>(`/invoices/${id}/recover`, {
      method: 'POST',
    });
  },
};
