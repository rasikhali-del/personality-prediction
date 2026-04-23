// Admin API – Node.js backend at port 5000
const API_BASE_URL = 'http://localhost:5000/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  total_tests: number;
}

export interface TestResult {
  id: number;
  user_id?: number;
  created_at?: string;
  text_result?: any;
  voice_result?: any;
  face_result?: any;
  fusion_result?: any;
  modalities_used?: string[];
  [key: string]: unknown;
}

export interface AdminStats {
  total_users: number;
  total_tests: number;
  tests_today: number;
  users_today: number;
}

type AdminUsersResponse = {
  users: AdminUser[];
  total: number;
  pages: number;
};

class AdminService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
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

  async getStats(): Promise<AdminStats> {
    return this.makeRequest<AdminStats>('/admin/stats');
  }

  async getUsers(search: string = '', page: number = 1, pageSize: number = 10): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    return this.makeRequest<AdminUsersResponse>(`/admin/users?${params.toString()}`);
  }

  async getUserDetails(userId: number): Promise<any> {
    return this.makeRequest<any>(`/admin/users/${userId}`);
  }

  async getAllResults(page: number = 1, pageSize: number = 20): Promise<any> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    return this.makeRequest<any>(`/admin/results?${params.toString()}`);
  }
}

export const adminService = new AdminService();
