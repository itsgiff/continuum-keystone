import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();

  // If already logged in, redirect to dashboard
  if (user) {
    throw redirect(303, '/dashboard');
  }

  return {};
};
