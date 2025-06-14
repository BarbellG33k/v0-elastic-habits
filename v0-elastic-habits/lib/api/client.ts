import { ApiResponse, ApiError } from './types';

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private headers: Record<string, string>;

  constructor(options: {
    baseUrl: string;
    defaultTimeout?: number;
    defaultRetries?: number;
    defaultRetryDelay?: number;
    headers?: Record<string, string>;
  }) {
    this.baseUrl = options.baseUrl;
    this.defaultTimeout = options.defaultTimeout || 5000;
    this.defaultRetries = options.defaultRetries || 1;
    this.defaultRetryDelay = options.defaultRetryDelay || 1000;
    this.headers = options.headers || {};
  }

  async get<T>(path: string, options?: { timeout?: number; retries?: number; retryDelay?: number }): Promise<ApiResponse<T>> {
    return this.request<T>(path, 'GET', undefined, options);
  }

  async post<T>(path: string, data: any, options?: { timeout?: number; retries?: number; retryDelay?: number }): Promise<ApiResponse<T>> {
    return this.request<T>(path, 'POST', data, options);
  }

  private async request<T>(
    path: string,
    method: string,
    data?: any,
    options?: { timeout?: number; retries?: number; retryDelay?: number }
  ): Promise<ApiResponse<T>> {
    const timeout = options?.timeout || this.defaultTimeout;
    const retries = options?.retries || this.defaultRetries;
    const retryDelay = options?.retryDelay || this.defaultRetryDelay;

    let attempt = 0;
    while (attempt <= retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${this.baseUrl}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...this.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error: ApiError = {
            code: `HTTP_${response.status}`,
            message: response.statusText || 'HTTP error',
            status: response.status,
            details: errorData,
          };
          return { data: null as any, error };
        }

        const responseData = await response.json();
        return { data: responseData };
      } catch (error) {
        if (attempt === retries) {
          const apiError: ApiError = {
            code: 'UNKNOWN_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 500,
          };
          return { data: null as any, error: apiError };
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        attempt++;
      }
    }
    throw new Error('Unexpected error in request');
  }
} 