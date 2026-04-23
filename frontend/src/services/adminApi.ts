import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  date_joined?: string;
  is_staff: boolean;
  is_superuser: boolean;
  total_tests?: number;
}

export interface TestResult {
  id: number;
  created_at?: string;
  modality?: string;
  text_result?: any;
  voice_result?: any;
  face_result?: any;
  fusion_result?: any;
  modalities_used?: string[];
  results?: unknown;
  [key: string]: unknown;
}

type AdminUsersResponse = {
  users: AdminUser[];
  total: number;
  pages: number;
};

class AdminService {
  private getAuthHeaders(): HeadersInit {
    const token = authService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error((error as any).error || `HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async getUsers(search: string = '', page: number = 1, pageSize: number = 10): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    return this.makeRequest<AdminUsersResponse>(`/admin/users/?${params.toString()}`);
  }

  async getUserDetails(userId: number): Promise<any> {
    return this.makeRequest<any>(`/admin/users/${userId}/`);
  }
}

export const adminService = new AdminService();
