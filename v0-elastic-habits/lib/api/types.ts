export interface ApiResponse<T> {
  data: T | null;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
  details?: any;
} 