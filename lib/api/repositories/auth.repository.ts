import { BaseRepository } from './base.repository';
import { ApiResponse } from '../types';
import { ApiClient } from '../client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class AuthRepository extends BaseRepository {
  constructor(client: ApiClient) {
    super(client, '/auth');
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/login', credentials);
  }

  async register(userData: LoginCredentials & { name?: string }): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/register', userData);
  }

  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/refresh', request);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>('/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
    return this.get<AuthResponse['user']>('/me');
  }
} 