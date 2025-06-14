interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class RequestCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default TTL
    this.defaultTTL = defaultTTL;
  }

  private generateKey(method: string, url: string, params?: Record<string, string>): string {
    const sortedParams = params ? Object.entries(params).sort().join('&') : '';
    return `${method}:${url}:${sortedParams}`;
  }

  set<T>(method: string, url: string, data: T, ttl?: number, params?: Record<string, string>): void {
    const key = this.generateKey(method, url, params);
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttl ?? this.defaultTTL),
    });
  }

  get<T>(method: string, url: string, params?: Record<string, string>): T | null {
    const key = this.generateKey(method, url, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  remove(method: string, url: string, params?: Record<string, string>): void {
    const key = this.generateKey(method, url, params);
    this.cache.delete(key);
  }
} 