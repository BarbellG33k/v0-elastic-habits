export interface ApiResponse<T> {
  data: T;
  metadata: ApiResponseMetadata;
  error?: ApiError;
}

export interface ApiResponseMetadata {
  timestamp: string;
  requestId: string;
  duration: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status?: number;
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions extends ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, string>;
}

export interface ApiClientConfig {
  baseUrl: string;
  defaultTimeout?: number;
  defaultRetries?: number;
  defaultRetryDelay?: number;
  defaultHeaders?: Record<string, string>;
} 