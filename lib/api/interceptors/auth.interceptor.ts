import { ApiRequestOptions } from '../types';

export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

export class AuthInterceptor {
  constructor(private readonly tokenStorage: TokenStorage) {}

  async interceptRequest(options: ApiRequestOptions): Promise<ApiRequestOptions> {
    const accessToken = this.tokenStorage.getAccessToken();
    
    if (accessToken) {
      return {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      };
    }

    return options;
  }

  async interceptResponse<T>(response: T): Promise<T> {
    // Here you could implement refresh token logic if needed
    return response;
  }

  async interceptError(error: unknown): Promise<never> {
    // Here you could implement token refresh on 401 errors
    throw error;
  }
} 