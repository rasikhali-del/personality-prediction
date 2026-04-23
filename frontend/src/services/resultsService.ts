/**
 * Test Results service for frontend
 * Handles saving and retrieving personality test results
 */

import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  [key: string]: unknown;
}

export interface TestResult {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  text_result?: PersonalityTraits;
  voice_result?: PersonalityTraits;
  face_result?: PersonalityTraits;
  fusion_result?: PersonalityTraits & {
    mbti_type?: string;
    personality_name?: string;
    confidence?: number;
  };
  modalities_used: string[];
  created_at: string;
  updated_at: string;
}

export interface SaveResultPayload {
  text_result?: PersonalityTraits;
  voice_result?: PersonalityTraits;
  face_result?: PersonalityTraits;
  fusion_result?: PersonalityTraits;
}

class ResultsService {
  /**
   * Save test result to backend
   */
  async saveTestResult(payload: SaveResultPayload): Promise<TestResult> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/results/save/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save result');
      }

      const data: TestResult = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw error;
    }
  }

  /**
   * Get user's test results
   */
  async getUserResults(page: number = 1, pageSize: number = 10): Promise<{
    results: TestResult[];
    total: number;
    pages: number;
    current_page: number;
  }> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });

      const response = await fetch(`${API_BASE_URL}/results/?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      return {
        results: data.results,
        total: data.total,
        pages: data.pages,
        current_page: data.page,
      };
    } catch (error) {
      console.error('Error fetching user results:', error);
      throw error;
    }
  }

  /**
   * Get specific test result
   */
  async getTestResult(resultId: number): Promise<TestResult> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/results/${resultId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Result not found');
      }

      const data: TestResult = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching test result:', error);
      throw error;
    }
  }

  /**
   * Delete test result
   */
  async deleteTestResult(resultId: number): Promise<boolean> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await fetch(`${API_BASE_URL}/results/${resultId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total_tests: number;
    text_tests: number;
    voice_tests: number;
    face_tests: number;
    fusion_tests: number;
    last_test: string | null;
  }> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/results/stats/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Export results as JSON
   */
  async exportResultsAsJson(): Promise<Blob> {
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/results/export/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export results');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting results:', error);
      throw error;
    }
  }

  /**
   * Calculate average traits from multiple results
   */
  calculateAverageTraits(results: TestResult[]): PersonalityTraits {
    if (results.length === 0) {
      return {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0,
      };
    }

    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const averages: any = {};

    traits.forEach(trait => {
      const values = results
        .filter(r => r.fusion_result && r.fusion_result[trait])
        .map(r => (r.fusion_result as any)[trait]);

      averages[trait] = values.length > 0 
        ? values.reduce((a, b) => a + b, 0) / values.length 
        : 0;
    });

    return averages;
  }

  /**
   * Get trend data for charts
   */
  getTrendData(results: TestResult[]): {
    dates: string[];
    openness: number[];
    conscientiousness: number[];
    extraversion: number[];
    agreeableness: number[];
    neuroticism: number[];
  } {
    const sortedResults = [...results].reverse();
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const trendData: any = {
      dates: [],
    };

    traits.forEach(trait => {
      trendData[trait] = [];
    });

    sortedResults.forEach(result => {
      trendData.dates.push(new Date(result.created_at).toLocaleDateString());
      if (result.fusion_result) {
        traits.forEach(trait => {
          trendData[trait].push((result.fusion_result as any)[trait] || 0);
        });
      }
    });

    return trendData;
  }
}

// Export singleton instance
export const resultsService = new ResultsService();
