// API base for Node.js backend at port 5000
const API_BASE_URL = 'http://localhost:5000/api';

export interface PersonalityResult {
  text_result?: any;
  voice_result?: any;
  face_result?: any;
  fusion_result?: any;
}

export interface StoredTestResult {
  id: number;
  user_id: number;
  text_result?: any;
  voice_result?: any;
  face_result?: any;
  fusion_result?: any;
  modalities_used: string[];
  created_at: string;
  updated_at: string;
}

class ResultsService {
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

  async saveTestResult(result: PersonalityResult): Promise<StoredTestResult> {
    return this.makeRequest<StoredTestResult>('/results/save', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getUserResults(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    results: StoredTestResult[];
    total: number;
    page: number;
    page_size: number;
    pages: number;
  }> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('page_size', String(pageSize));
    return this.makeRequest(`/results?${params.toString()}`);
  }
}

export const resultsService = new ResultsService();
