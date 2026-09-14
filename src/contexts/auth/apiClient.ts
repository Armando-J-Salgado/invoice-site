function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  // When running in dev mode, use relative URL so the Vite proxy forwards to backend without CORS
  if (import.meta.env.DEV && (!envUrl || envUrl.includes('127.0.0.1:3000'))) {
    return '';
  }
  return (envUrl || '').replace(/\/+$/, '');
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem('invoice_token');

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (customConfig.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('invoice_token');
      localStorage.removeItem('invoice_user');
      // If we are not already on login page, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new ApiError('Sesión expirada o no autorizada', 401);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || `Error del servidor (${response.status})`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Error de conexión con el servidor', 0);
  }
}
