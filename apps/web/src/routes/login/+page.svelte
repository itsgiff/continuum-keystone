<script lang="ts">
  import { authApi, ApiError } from '$lib/api';
  import { currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const user = await authApi.login(email, password);
      currentUser.set(user);
      goto('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        error = err.message;
      } else {
        error = 'An unexpected error occurred';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">Sign in to Keystone</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
          create a new account
        </a>
      </p>
    </div>

    <form class="card space-y-6" onsubmit={handleSubmit}>
      {#if error}
        <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      {/if}

      <div>
        <label for="email" class="label">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="input"
          bind:value={email}
          disabled={loading}
        />
      </div>

      <div>
        <label for="password" class="label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          class="input"
          bind:value={password}
          disabled={loading}
        />
      </div>

      <div>
        <button type="submit" class="w-full btn btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  </div>
</div>
