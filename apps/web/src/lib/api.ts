export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiCall<T = unknown>(
  path: string,
  options: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
    ...options,
  });

  if (!response.ok) {
    let error: { message?: string; code?: string } = { message: 'API error' };
    try {
      error = await response.json();
    } catch {
      // Response not JSON
    }
    throw new ApiError(error.message || 'API error', response.status, error.code);
  }

  return response.json();
}

export interface User {
  userId: string;
  email: string;
  name: string;
}

export const authApi = {
  async register(email: string, password: string, name: string): Promise<User> {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async login(email: string, password: string): Promise<User> {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<void> {
    await apiCall('/auth/logout', { method: 'POST' });
  },

  async me(): Promise<User> {
    return apiCall('/auth/me');
  },
};
