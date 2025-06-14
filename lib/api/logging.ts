import { ApiRequestOptions, ApiResponse, ApiError } from './types';

export class ApiLogger {
  private static instance: ApiLogger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger();
    }
    return ApiLogger.instance;
  }

  logRequest(options: ApiRequestOptions): void {
    if (!this.isDevelopment) return;

    console.group(`🚀 API Request: ${options.method} ${options.url}`);
    console.log('Headers:', options.headers);
    if (options.data) console.log('Body:', options.data);
    if (options.params) console.log('Params:', options.params);
    console.groupEnd();
  }

  logResponse<T>(response: ApiResponse<T>, duration: number): void {
    if (!this.isDevelopment) return;

    console.group(`✅ API Response: ${response.metadata.requestId}`);
    console.log('Duration:', `${duration}ms`);
    console.log('Data:', response.data);
    if (response.error) {
      console.error('Error:', response.error);
    }
    console.groupEnd();
  }

  logError(error: ApiError, requestId: string): void {
    console.error(`❌ API Error [${requestId}]:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      status: error.status,
    });
  }

  logPerformance(operation: string, duration: number): void {
    if (!this.isDevelopment) return;
    console.log(`⏱️ Performance [${operation}]: ${duration}ms`);
  }
} 