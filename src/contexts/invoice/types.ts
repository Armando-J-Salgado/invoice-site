import type { Customer } from '../customer/types';
import type { ProductVariant } from '../product/types';

export type PaymentMethod = 'CASH' | 'NEQUI' | 'TRANSFER';
export type InvoiceType = 'CONTADO' | 'FACTURA';

export interface SaleItem {
  id?: number;
  productVariantId: number;
  quantity: number;
  unitPrice?: string | number;
  totalPrice?: string | number;
  productVariant?: ProductVariant;
}

export interface Invoice {
  id: number;
  total: string | number;
  date?: string | Date;
  paymentMethod: PaymentMethod;
  type: InvoiceType;
  customerId?: number | null;
  customer?: Customer | null;
  sales: SaleItem[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateInvoiceSaleDto {
  productVariantId: number;
  quantity: number;
}

export interface CreateInvoiceDto {
  paymentMethod: PaymentMethod;
  type: InvoiceType;
  customerId?: number;
  sales: CreateInvoiceSaleDto[];
}

export interface InvoiceFilterParams {
  startDate?: string;
  endDate?: string;
  type?: InvoiceType;
  onlyDeleted?: boolean;
  withDeleted?: boolean;
}

export interface DraftCartItem {
  variant: ProductVariant;
  quantity: number;
}
