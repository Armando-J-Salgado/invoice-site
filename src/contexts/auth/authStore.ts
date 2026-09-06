import { create } from 'zustand';
import type { AuthState, LoginCredentials, User } from './types';
import { authApi } from './api';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('invoice_token'),
  user: localStorage.getItem('invoice_user')
    ? JSON.parse(localStorage.getItem('invoice_user')!)
    : null,
  isAuthenticated: !!localStorage.getItem('invoice_token'),
  isLoading: false,

  initialize: () => {
    const token = localStorage.getItem('invoice_token');
    const userStr = localStorage.getItem('invoice_user');
    if (token) {
      set({
        token,
        user: userStr ? JSON.parse(userStr) : null,
        isAuthenticated: true,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const res = await authApi.login(credentials);
      const token = res.access_token;
      const user: User = res.user || { email: credentials.email };

      localStorage.setItem('invoice_token', token);
      localStorage.setItem('invoice_user', JSON.stringify(user));

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authApi.logout();
    localStorage.removeItem('invoice_token');
    localStorage.removeItem('invoice_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
