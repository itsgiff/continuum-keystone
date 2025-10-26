<script lang="ts">
  import { currentUser } from '$lib/stores';

  let { data } = $props();

  const navItems = [
    { name: 'Assets', href: '#', description: 'Track devices and equipment' },
    { name: 'Software', href: '#', description: 'Manage software licenses' },
    { name: 'Services', href: '#', description: 'Online accounts and subscriptions' },
    { name: 'Warranties', href: '#', description: 'Warranty information' },
    { name: 'Runbooks', href: '#', description: 'Maintenance procedures' },
    { name: 'Exports', href: '#', description: 'Export and backup data' },
    { name: 'Settings', href: '#', description: 'Account settings' },
  ];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">
      Welcome, {$currentUser?.name || data.user?.name || 'User'}!
    </h1>
    <p class="mt-2 text-gray-600">Manage your digital estate from this dashboard.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each navItems as item}
      <a
        href={item.href}
        class="card hover:shadow-lg transition-shadow border border-gray-200"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p class="text-gray-600 text-sm">{item.description}</p>
        <p class="mt-4 text-xs text-gray-400">Coming soon...</p>
      </a>
    {/each}
  </div>

  <div class="mt-12 card bg-blue-50 border border-blue-200">
    <h2 class="text-xl font-semibold text-blue-900 mb-4">Getting Started</h2>
    <ul class="space-y-2 text-sm text-blue-800">
      <li>✓ Your account is set up and ready to use</li>
      <li>• Start by adding your first asset or device</li>
      <li>• Configure software licenses and subscriptions</li>
      <li>• Set up warranty tracking for important items</li>
      <li>• Create runbooks for maintenance procedures</li>
    </ul>
  </div>
</div>
