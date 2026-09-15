import { create } from 'zustand';
import type { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerFilterParams } from './types';
import { customerApi } from './api';
import { validateCreateUserData, validateUpdateCustomerData } from './validations';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;

  fetchCustomers: (params?: CustomerFilterParams) => Promise<void>;
  createCustomer: (data: CreateCustomerDto) => Promise<Customer>;
  updateCustomer: (id: number, data: UpdateCustomerDto) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;
  recoverCustomer: (id: number) => Promise<void>;
  setSelectedCustomer: (customer: Customer | null) => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,

  fetchCustomers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const customers = await customerApi.getCustomers(params);
      set({ customers, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createCustomer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = validateCreateUserData(data)
      if(!result.success) {
        throw new TypeError(result.message)
      }
      const newCustomer = await customerApi.createCustomer(data);
      set((state) => ({
        customers: [newCustomer, ...state.customers],
        isLoading: false,
      }));
      return newCustomer;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateCustomer: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const result = validateUpdateCustomerData(data);
      if(!result.success) {
        throw new TypeError(result.message);
      }
      const updated = await customerApi.updateCustomer(id, data);
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customerApi.deleteCustomer(id);
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  recoverCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await customerApi.recoverCustomer(id);
      await get().fetchCustomers();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));
