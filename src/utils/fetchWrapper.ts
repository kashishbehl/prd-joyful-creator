const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchWrapper = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${apiUrl}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const defaultHeaders = isFormData
    ? {} // Let the browser set the Content-Type for FormData
    : { 'Content-Type': 'application/json' };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
