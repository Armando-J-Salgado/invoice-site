import type { ProductVariant } from '../product/types';

export interface Customer {
  id: number;
  name: string;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  favoriteProductId?: number | null;
  favoriteProduct?: ProductVariant | null;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
}

export interface CreateCustomerDto {
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  favoriteProductId?: number;
}

export interface UpdateCustomerDto {
  name?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  favoriteProductId?: number;
}

export interface CustomerFilterParams {
  name?: string;
  email?: string;
  onlyDeleted?: boolean;
  withDeleted?: boolean;
}
