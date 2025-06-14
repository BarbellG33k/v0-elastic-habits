import { v4 as uuidv4 } from 'uuid';
import {
  ApiClientConfig,
  ApiRequestOptions,
  ApiResponse,
  ApiError,
} from './types';
import { ApiLogger } from './logging';

export class ApiClient {
  private config: Required<ApiClientConfig>;
  private logger: ApiLogger;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      defaultTimeout: config.defaultTimeout ?? 30000,
      defaultRetries: config.defaultRetries ?? 3,
      defaultRetryDelay: config.defaultRetryDelay ?? 1000,
      defaultHeaders: config.defaultHeaders ?? {},
    };
    this.logger = ApiLogger.getInstance();
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private createErrorResponse(
    error: unknown,
    requestId: string
  ): ApiResponse<null> {
    const apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof Response ? error.status : 500,
    };

    if (error instanceof Response) {
      apiError.code = `HTTP_${error.status}`;
      apiError.status = error.status;
      error.json().then(data => {
        apiError.details = data;
      }).catch(() => {
        // Ignore JSON parsing errors
      });
    }

    this.logger.logError(apiError, requestId);

    return {
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId,
        duration: 0,
      },
      error: apiError,
    };
  }

  private async executeRequest<T>(
    options: ApiRequestOptions,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const requestId = uuidv4();
    const startTime = Date.now();
    const {
      method,
      url,
      data,
      params,
      timeout = this.config.defaultTimeout,
      retries = this.config.defaultRetries,
      retryDelay = this.config.defaultRetryDelay,
      headers = {},
    } = options;

    const fullUrl = new URL(url, this.config.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fullUrl.searchParams.append(key, value);
      });
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.config.defaultHeaders,
        ...headers,
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    this.logger.logRequest(options);

    try {
      const response = await this.fetchWithTimeout(
        fullUrl.toString(),
        requestOptions,
        timeout
      );

      const duration = Date.now() - startTime;

      if (!response.ok) {
        // Parse error details if possible
        let errorDetails = undefined;
        try {
          errorDetails = await response.json();
        } catch {}
        const apiError: ApiError = {
          code: `HTTP_${response.status}`,
          message: response.statusText || 'HTTP error',
          status: response.status,
          details: errorDetails,
        };
        this.logger.logError(apiError, requestId);
        return {
          data: null as any,
          metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            duration,
          },
          error: apiError,
        };
      }

      const responseData = await response.json();
      const apiResponse: ApiResponse<T> = {
        data: responseData,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId,
          duration,
        },
      };

      this.logger.logResponse(apiResponse, duration);
      return apiResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.logPerformance(`${method} ${url}`, duration);

      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.executeRequest<T>(options, attempt + 1);
      }

      return this.createErrorResponse(error, requestId) as ApiResponse<T>;
    }
  }

  async get<T>(url: string, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({ ...options, method: 'GET', url });
  }

  async post<T>(url: string, data?: unknown, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({ ...options, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: unknown, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({ ...options, method: 'PUT', url, data });
  }

  async delete<T>(url: string, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({ ...options, method: 'DELETE', url });
  }

  async patch<T>(url: string, data?: unknown, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.executeRequest<T>({ ...options, method: 'PATCH', url, data });
  }
} 