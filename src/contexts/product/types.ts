export interface ProductVariant {
  id: number;
  name: string;
  price: string | number;
  productId: number;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
  product?: Product;
}

export interface Product {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deleted_at?: string | null;
  variants?: ProductVariant[];
}

export interface CreateProductDto {
  name: string;
}

export interface UpdateProductDto {
  name?: string;
}

export interface CreateProductVariantDto {
  name: string;
  price: number;
  productId: number;
}

export interface UpdateProductVariantDto {
  name?: string;
  price?: number;
}

export interface ProductFilterParams {
  name?: string;
  startDate?: string;
  endDate?: string;
  onlyDeleted?: boolean;
  withDeleted?: boolean;
}

export interface VariantFilterParams {
  name?: string;
  onlyDeleted?: boolean;
  withDeleted?: boolean;
}
