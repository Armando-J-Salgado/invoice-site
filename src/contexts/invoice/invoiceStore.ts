import { create } from 'zustand';
import type {
  Invoice,
  CreateInvoiceDto,
  InvoiceFilterParams,
  DraftCartItem,
  PaymentMethod,
  InvoiceType,
} from './types';
import type { ProductVariant } from '../product/types';
import type { Customer } from '../customer/types';
import { invoiceApi } from './api';

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;

  // Active Filters
  filters: InvoiceFilterParams;
  setFilters: (filters: Partial<InvoiceFilterParams>) => void;
  resetFilters: () => void;

  // Draft / Cart State for Invoice Elaboration
  draftType: InvoiceType;
  draftPaymentMethod: PaymentMethod;
  draftCustomer: Customer | null;
  draftCart: DraftCartItem[];

  setDraftType: (type: InvoiceType) => void;
  setDraftPaymentMethod: (method: PaymentMethod) => void;
  setDraftCustomer: (customer: Customer | null) => void;
  addVariantToCart: (variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (variantId: number, quantity: number) => void;
  removeCartItem: (variantId: number) => void;
  clearDraft: () => void;

  // Actions
  fetchInvoices: (params?: InvoiceFilterParams) => Promise<void>;
  fetchInvoiceById: (id: number) => Promise<Invoice>;
  createInvoice: () => Promise<Invoice>;
  deleteInvoice: (id: number) => Promise<void>;
  recoverInvoice: (id: number) => Promise<void>;
}

const initialFilters: InvoiceFilterParams = {
  startDate: undefined,
  endDate: undefined,
  type: undefined,
  onlyDeleted: false,
  withDeleted: false,
};

export const useInvoiceStore = create<InvoiceState>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,

  filters: initialFilters,

  setFilters: (newFilters) => {
    const updated = { ...get().filters, ...newFilters };
    set({ filters: updated });
    get().fetchInvoices(updated);
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchInvoices(initialFilters);
  },

  // Draft state
  draftType: 'CONTADO',
  draftPaymentMethod: 'CASH',
  draftCustomer: null,
  draftCart: [],

  setDraftType: (type) => set({ draftType: type }),
  setDraftPaymentMethod: (method) => set({ draftPaymentMethod: method }),
  setDraftCustomer: (customer) => set({ draftCustomer: customer }),

  addVariantToCart: (variant, quantity = 1) => {
    const { draftCart } = get();
    const existingIndex = draftCart.findIndex((item) => item.variant.id === variant.id);

    if (existingIndex > -1) {
      const updated = [...draftCart];
      updated[existingIndex].quantity += quantity;
      set({ draftCart: updated });
    } else {
      set({ draftCart: [...draftCart, { variant, quantity }] });
    }
  },

  updateCartQuantity: (variantId, quantity) => {
    const { draftCart } = get();
    if (quantity <= 0) {
      set({ draftCart: draftCart.filter((item) => item.variant.id !== variantId) });
    } else {
      set({
        draftCart: draftCart.map((item) =>
          item.variant.id === variantId ? { ...item, quantity } : item
        ),
      });
    }
  },

  removeCartItem: (variantId) => {
    set({
      draftCart: get().draftCart.filter((item) => item.variant.id !== variantId),
    });
  },

  clearDraft: () => {
    set({
      draftType: 'CONTADO',
      draftPaymentMethod: 'CASH',
      draftCustomer: null,
      draftCart: [],
    });
  },

  fetchInvoices: async (customParams) => {
    set({ isLoading: true, error: null });
    const params = customParams || get().filters;
    try {
      const invoices = await invoiceApi.getInvoices(params);
      set({ invoices, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchInvoiceById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const invoice = await invoiceApi.getInvoiceById(id);
      set({ currentInvoice: invoice, isLoading: false });
      return invoice;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createInvoice: async () => {
    const { draftType, draftPaymentMethod, draftCustomer, draftCart } = get();

    if (draftCart.length === 0) {
      throw new Error('Debe agregar al menos un producto a la factura.');
    }

    if (draftType === 'FACTURA' && !draftCustomer) {
      throw new Error('Debe seleccionar un cliente para comprobantes tipo FACTURA.');
    }

    const payload: CreateInvoiceDto = {
      type: draftType,
      paymentMethod: draftPaymentMethod,
      customerId: draftCustomer ? draftCustomer.id : undefined,
      sales: draftCart.map((item) => ({
        productVariantId: item.variant.id,
        quantity: item.quantity,
      })),
    };

    set({ isLoading: true, error: null });
    try {
      const created = await invoiceApi.createInvoice(payload);
      get().clearDraft();
      set({ isLoading: false });
      return created;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await invoiceApi.deleteInvoice(id);
      await get().fetchInvoices();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  recoverInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await invoiceApi.recoverInvoice(id);
      await get().fetchInvoices();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
