import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, url }) => {
  // Try to get current user
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      return { user };
    }
  } catch {
    // Not authenticated
  }

  // Redirect to login if accessing protected routes
  const protectedRoutes = ['/dashboard', '/'];
  if (protectedRoutes.includes(url.pathname)) {
    return {
      user: null,
      redirect: '/login',
    };
  }

  return { user: null };
};
