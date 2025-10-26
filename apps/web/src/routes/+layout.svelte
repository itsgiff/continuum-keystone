<script lang="ts">
  import '../app.css';
  import { currentUser } from '$lib/stores';
  import { authApi } from '$lib/api';
  import { onMount } from 'svelte';

  let { data, children } = $props();

  onMount(() => {
    if (data.user) {
      currentUser.set(data.user);
    }
  });

  async function handleLogout() {
    try {
      await authApi.logout();
      currentUser.set(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

<div class="min-h-screen flex flex-col">
  {#if $currentUser}
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-blue-600">Keystone</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {$currentUser.name}</span>
            <button onclick={handleLogout} class="btn btn-secondary text-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  {/if}

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="bg-gray-100 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
      Keystone v0.1 - Digital Estate Management
    </div>
  </footer>
</div>
