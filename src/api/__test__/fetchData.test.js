import { fetchData } from '@/api';
import { ERROR_MESSAGE } from '@/constants';

// Mock the constants module
jest.mock('@/constants', () => ({
  BASE_URL: 'https://mock-base-url.com',
  ERROR_MESSAGE: 'Sorry, something went wrong, so we could not fetch data to process the incoming request, please try again later. The error logs are below:',
}));

global.fetch = jest.fn();

describe('fetchData', () => {
  const requestUrl = 'https://mock-base-url.com/test-endpoint';

  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches successfully from an API', async () => {
    const mockResponse = { data: 'test data' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchData('test-endpoint');
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('throws an error if response is not ok', async () => {
    const mockErrorDetail = 'Not Found';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValueOnce(mockErrorDetail),
    });

    await expect(fetchData('test-endpoint')).rejects.toThrow(`Request failed with status 404: ${mockErrorDetail}`);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('throws an error if fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchData('test-endpoint')).rejects.toThrow('Network Error');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('logs error message if response is not ok', async () => {
    console.error = jest.fn();
    const mockErrorDetail = 'Not Found';
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValueOnce(mockErrorDetail),
    });

    await expect(fetchData('test-endpoint')).rejects.toThrow(`Request failed with status 404: ${mockErrorDetail}`);
    expect(console.error).toHaveBeenCalledWith(ERROR_MESSAGE, mockErrorDetail);
  });

  it('logs error message if fetch fails', async () => {
    console.error = jest.fn();
    const networkError = new Error('Network Error');
    fetch.mockRejectedValueOnce(networkError);

    await expect(fetchData('test-endpoint')).rejects.toThrow('Network Error');
    expect(console.error).toHaveBeenCalledWith(ERROR_MESSAGE, networkError);
  });
});
