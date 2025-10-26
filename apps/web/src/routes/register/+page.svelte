<script lang="ts">
  import { authApi, ApiError } from '$lib/api';
  import { currentUser } from '$lib/stores';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let name = $state('');
  let error = $state('');
  let loading = $state(false);
  let passwordStrength = $state('');

  function checkPasswordStrength(pwd: string) {
    if (pwd.length < 8) {
      passwordStrength = 'Too short (minimum 8 characters)';
      return;
    }

    let strength = 0;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength < 3) {
      passwordStrength = 'Weak - needs uppercase, lowercase, and number';
    } else if (strength === 3) {
      passwordStrength = 'Good';
    } else {
      passwordStrength = 'Strong';
    }
  }

  $effect(() => {
    checkPasswordStrength(password);
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      await authApi.register(email, password, name);
      // Auto-login after registration
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
      <h2 class="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
          sign in to existing account
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
        <label for="name" class="label">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          class="input"
          bind:value={name}
          disabled={loading}
        />
      </div>

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
        {#if password}
          <p
            class="mt-1 text-sm"
            class:text-red-600={passwordStrength.includes('Weak') ||
              passwordStrength.includes('short')}
            class:text-yellow-600={passwordStrength === 'Good'}
            class:text-green-600={passwordStrength === 'Strong'}
          >
            {passwordStrength}
          </p>
        {/if}
      </div>

      <div>
        <button type="submit" class="w-full btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </form>
  </div>
</div>
