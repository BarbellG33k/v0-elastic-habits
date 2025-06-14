import { ApiClient } from '../client';
import { ApiResponse } from '../types';

describe('ApiClient', () => {
  let client: ApiClient;
  const mockBaseUrl = 'https://api.example.com';

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: mockBaseUrl,
      defaultTimeout: 5000,
      defaultRetries: 1,
      defaultRetryDelay: 10,
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request successfully', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    const response = await client.get<typeof mockResponse>('/test');
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/test`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(response.data).toEqual(mockResponse);
    expect(response.metadata).toBeDefined();
    expect(response.metadata.requestId).toBeDefined();
  });

  it('should handle request timeout', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10))
    );
    const response = await client.get('/test', { timeout: 5 });
    expect(response.error).toBeDefined();
    expect(response.error?.code).toBe('UNKNOWN_ERROR');
    expect(response.error?.message).toContain('Timeout');
  });

  it('should retry failed requests', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
    const response = await client.get<typeof mockResponse>('/test', { retries: 2, retryDelay: 1 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(response.data).toEqual(mockResponse);
  });

  it('should handle HTTP errors', async () => {
    const errorResponse = new Response(JSON.stringify({ message: 'Not Found' }), {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'application/json' },
    });
    (global.fetch as jest.Mock).mockResolvedValueOnce(errorResponse);
    const response = await client.get('/test');
    expect(response.error).toBeDefined();
    expect(response.error?.code).toBe('HTTP_404');
    expect(response.error?.status).toBe(404);
  });

  it('should make a POST request with data', async () => {
    const mockData = { name: 'Test' };
    const mockResponse = { data: { id: 1, ...mockData } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    const response = await client.post<typeof mockResponse>('/test', mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/test`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockData),
      })
    );
    expect(response.data).toEqual(mockResponse);
  });
}); 