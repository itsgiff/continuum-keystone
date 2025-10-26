<script lang="ts">
  // Skeleton Table component
  // To be expanded in future PRs

  let {
    columns = [],
    data = [],
  }: {
    columns: string[];
    data: any[];
  } = $props();
</script>

<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        {#each columns as column}
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {column}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#if data.length === 0}
        <tr>
          <td colspan={columns.length} class="px-6 py-4 text-center text-gray-500">
            No data available
          </td>
        </tr>
      {:else}
        {#each data as row}
          <tr>
            {#each columns as column}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row[column] || '-'}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
