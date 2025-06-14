import { ApiClient } from '../client';
import { ApiResponse } from '../types';

export class HabitsRepository {
  private client: ApiClient;

  constructor(token: string) {
    this.client = new ApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      defaultTimeout: 5000,
      defaultRetries: 1,
      defaultRetryDelay: 10,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getHabits(): Promise<ApiResponse<any>> {
    const response = await this.client.get<any>('/habits');
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response;
  }

  async getHabit(id: string): Promise<ApiResponse<any>> {
    const response = await this.client.get<any>(`/habits/${id}`);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response;
  }
} 