import { ApiClient } from '../client';
import { ApiRequestOptions, ApiResponse } from '../types';

export abstract class BaseRepository {
  protected constructor(
    protected readonly client: ApiClient,
    protected readonly basePath: string
  ) {}

  protected async get<T>(path: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return this.client.get<T>(`${this.basePath}${path}`, options);
  }

  protected async post<T>(path: string, data?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return this.client.post<T>(`${this.basePath}${path}`, data, options);
  }

  protected async put<T>(path: string, data?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return this.client.put<T>(`${this.basePath}${path}`, data, options);
  }

  protected async delete<T>(path: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return this.client.delete<T>(`${this.basePath}${path}`, options);
  }

  protected async patch<T>(path: string, data?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return this.client.patch<T>(`${this.basePath}${path}`, data, options);
  }
} 