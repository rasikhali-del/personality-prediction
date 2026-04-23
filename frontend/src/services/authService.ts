// Auth service pointing to Node.js backend at port 5000
const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

class AuthService {
  private accessToken: string | null = null;
  private user: User | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('access_token');
  }

  async register(username: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    const data: AuthResponse = await response.json();
    localStorage.setItem('access_token', data.token);
    this.accessToken = data.token;
    this.user = data.user;
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data: AuthResponse = await response.json();
    localStorage.setItem('access_token', data.token);
    this.accessToken = data.token;
    this.user = data.user;
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) return null;
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!response.ok) { this.logout(); return null; }
    const data = await response.json();
    this.user = data.user;
    return data.user;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.accessToken = null;
    this.user = null;
  }

  getAccessToken(): string | null { return this.accessToken; }
  getUser(): User | null { return this.user; }
  isAuthenticated(): boolean { return !!this.accessToken; }
  isAdmin(): boolean { return this.user?.is_admin || false; }
}

export const authService = new AuthService();
