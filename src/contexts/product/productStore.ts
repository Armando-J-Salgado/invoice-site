import { create } from 'zustand';
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
import { productApi } from './api';

interface ProductState {
  products: Product[];
  variants: ProductVariant[];
  isLoading: boolean;
  error: string | null;

  fetchProducts: (params?: ProductFilterParams) => Promise<void>;
  fetchVariants: (params?: VariantFilterParams) => Promise<void>;
  createProduct: (data: CreateProductDto) => Promise<Product>;
  updateProduct: (id: number, data: UpdateProductDto) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  recoverProduct: (id: number) => Promise<void>;

  createVariant: (data: CreateProductVariantDto) => Promise<ProductVariant>;
  updateVariant: (id: number, data: UpdateProductVariantDto) => Promise<ProductVariant>;
  deleteVariant: (id: number) => Promise<void>;
  recoverVariant: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  variants: [],
  isLoading: false,
  error: null,

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productApi.getProducts(params);
      set({ products, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchVariants: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const variants = await productApi.getVariants(params);
      set({ variants, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productApi.createProduct(data);
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
      }));
      return newProduct;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await productApi.updateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  recoverProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.recoverProduct(id);
      await get().fetchProducts();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createVariant: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newVariant = await productApi.createVariant(data);
      set((state) => ({
        variants: [newVariant, ...state.variants],
        isLoading: false,
      }));
      return newVariant;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateVariant: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await productApi.updateVariant(id, data);
      set((state) => ({
        variants: state.variants.map((v) => (v.id === id ? { ...v, ...updated } : v)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteVariant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.deleteVariant(id);
      set((state) => ({
        variants: state.variants.filter((v) => v.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  recoverVariant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.recoverVariant(id);
      await get().fetchVariants();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));
