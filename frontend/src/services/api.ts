// API service for backend communication

const API_BASE_URL = 'http://localhost:8000/api';

export interface PersonalityResults {
  text?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  voice?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    detected_emotion?: string;
    emotion_confidence?: number;
  };
  face?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    dominant_emotion?: string;
    emotion_confidence?: number;
  };
  fusion?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    confidence: number;
    modalities_used: number;
  };
}

export interface TestSubmission {
  text?: string;
  voice?: File;
  face?: File;
}

class APIService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.makeRequest('/health/');
  }

  async submitPersonalityTest(data: TestSubmission): Promise<PersonalityResults> {
    const formData = new FormData();
    
    if (data.text) {
      formData.append('text', data.text);
    }
    
    if (data.voice) {
      formData.append('voice', data.voice);
    }
    
    if (data.face) {
      formData.append('face', data.face);
    }

    return this.makeRequest('/predict/multimodal/', {
      method: 'POST',
      body: formData,
    });
  }

  async submitIndividualTest(type: 'text' | 'voice' | 'face', data: string | File): Promise<any> {
    if (type === 'text') {
      return this.makeRequest('/predict/text/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data }),
      });
    } else {
      const formData = new FormData();
      formData.append(type, data as File);
      
      return this.makeRequest(`/predict/${type}/`, {
        method: 'POST',
        body: formData,
      });
    }
  }
}

export const apiService = new APIService();
