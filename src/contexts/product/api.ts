import { apiClient } from '../auth/apiClient';
import type {
  Product,
  ProductVariant,
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductFilterParams,
  VariantFilterParams,
} from './types';

export const productApi = {
  // Products
  getProducts: async (params?: ProductFilterParams): Promise<Product[]> => {
    return apiClient<Product[]>('/products', { params: params as any });
  },

  getProductById: async (id: number): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`);
  },

  createProduct: async (data: CreateProductDto): Promise<Product> => {
    return apiClient<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (id: number, data: UpdateProductDto): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: number): Promise<void> => {
    return apiClient<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  recoverProduct: async (id: number): Promise<void> => {
    return apiClient<void>(`/products/${id}/recover`, {
      method: 'POST',
    });
  },

  // Variants
  getVariants: async (params?: VariantFilterParams): Promise<ProductVariant[]> => {
    return apiClient<ProductVariant[]>('/products/variants', { params: params as any });
  },

  getVariantById: async (id: number): Promise<ProductVariant> => {
    return apiClient<ProductVariant>(`/products/variants/${id}`);
  },

  createVariant: async (data: CreateProductVariantDto): Promise<ProductVariant> => {
    return apiClient<ProductVariant>('/products/variants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateVariant: async (id: number, data: UpdateProductVariantDto): Promise<ProductVariant> => {
    return apiClient<ProductVariant>(`/products/variants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteVariant: async (id: number): Promise<void> => {
    return apiClient<void>(`/products/variants/${id}`, {
      method: 'DELETE',
    });
  },

  recoverVariant: async (id: number): Promise<void> => {
    return apiClient<void>(`/products/variants/${id}/recover`, {
      method: 'POST',
    });
  },
};
