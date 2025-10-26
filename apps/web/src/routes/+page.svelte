<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';

  let { data } = $props();

  onMount(() => {
    if (data.redirect) {
      goto(data.redirect);
    } else if (data.user || $currentUser) {
      goto('/dashboard');
    } else {
      goto('/login');
    }
  });
</script>

<div class="flex items-center justify-center min-h-screen">
  <p class="text-gray-600">Loading...</p>
</div>
