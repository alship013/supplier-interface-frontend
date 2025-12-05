
import { type SupplierData } from './supplierDatabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API response type
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API error class
class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Supplier API service
export const supplierApi = {
  // Create new supplier
  async createSupplier(supplierData: Partial<SupplierData>): Promise<SupplierData> {
    const response = await apiClient.post<SupplierData>('/suppliers', supplierData);
    return response.data!;
  },

  // Get all suppliers with pagination
  async getSuppliers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ suppliers: SupplierData[]; pagination: any }> {
    const response = await apiClient.get<SupplierData[]>('/suppliers', params);
    return {
      suppliers: response.data!,
      pagination: response.pagination
    };
  },

  // Get single supplier by ID
  async getSupplierById(id: string): Promise<SupplierData | null> {
    try {
      const response = await apiClient.get<SupplierData>(`/suppliers/${id}`);
      return response.data || null;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  // Update supplier
  async updateSupplier(id: string, supplierData: Partial<SupplierData>): Promise<SupplierData> {
    const response = await apiClient.put<SupplierData>(`/suppliers/${id}`, supplierData);
    return response.data!;
  },

  // Delete supplier
  async deleteSupplier(id: string): Promise<void> {
    await apiClient.delete(`/suppliers/${id}`);
  },

  // Verify supplier with OTP
  async verifySupplier(id: string, otp: string): Promise<{ verified: boolean; verificationTimestamp: string }> {
    const response = await apiClient.post(`/suppliers/${id}/verify`, { otp });
    return response.data!;
  },

  // Resend OTP
  async resendOTP(id: string): Promise<{ phoneNumber: string }> {
    const response = await apiClient.post(`/suppliers/${id}/resend-otp`);
    return response.data!;
  },

  // Get supplier statistics
  async getSupplierStats(): Promise<{
    totalSuppliers: number;
    activeSuppliers: number;
    pendingSuppliers: number;
    verifiedSuppliers: number;
    monthlyRegistrations: any[];
  }> {
    const response = await apiClient.get('/suppliers/stats');
    return response.data!;
  }
};

// Upload API service
export const uploadApi = {
  // Upload single image file
  async uploadImage(
    file: File,
    options: {
      type?: string;
      folder?: string;
      supplierId?: string;
    } = {}
  ): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);

    if (options.type) formData.append('type', options.type);
    if (options.folder) formData.append('folder', options.folder);
    if (options.supplierId) formData.append('supplierId', options.supplierId);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Upload failed',
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data.data;
  },

  // Upload multiple image files
  async uploadMultipleImages(
    files: File[],
    options: {
      type?: string;
      folder?: string;
      supplierId?: string;
    } = {}
  ): Promise<any> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    if (options.type) formData.append('type', options.type);
    if (options.folder) formData.append('folder', options.folder);
    if (options.supplierId) formData.append('supplierId', options.supplierId);

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Upload failed',
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data.data;
  },

  // Delete image file
  async deleteImage(
    filename: string,
    options: {
      supplierId?: string;
      photoId?: string;
    } = {}
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/upload/image/${filename}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Delete failed',
        response.status,
        errorData
      );
    }
  },

  // Get storage information
  async getStorageInfo(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/upload/storage-info`);

    if (!response.ok) {
      throw new ApiError('Failed to get storage info', response.status);
    }

    const data = await response.json();
    return data.data;
  }
};

// Health check
export const healthApi = {
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  }
};

// Export API client for advanced usage
export { apiClient, ApiError };

// Export types
export type { ApiResponse };