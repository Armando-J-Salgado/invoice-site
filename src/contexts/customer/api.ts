import { apiClient } from '../auth/apiClient';
import type { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerFilterParams } from './types';

export const customerApi = {
  getCustomers: async (params?: CustomerFilterParams): Promise<Customer[]> => {
    return apiClient<Customer[]>('/customers', { params: params as any });
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    return apiClient<Customer>(`/customers/${id}`);
  },

  createCustomer: async (data: CreateCustomerDto): Promise<Customer> => {
    return apiClient<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCustomer: async (id: number, data: UpdateCustomerDto): Promise<Customer> => {
    return apiClient<Customer>(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteCustomer: async (id: number): Promise<void> => {
    return apiClient<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },

  recoverCustomer: async (id: number): Promise<void> => {
    return apiClient<void>(`/customers/${id}/recover`, {
      method: 'POST',
    });
  },
};
