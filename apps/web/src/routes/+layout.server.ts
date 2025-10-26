import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

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
    throw redirect(303, '/login');
  }

  return { user: null };
};
