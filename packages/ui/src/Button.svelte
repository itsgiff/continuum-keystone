<script lang="ts">
  // Skeleton Button component
  // To be expanded in future PRs

  let {
    variant = 'primary',
    children,
    onclick,
    type,
    disabled,
  }: {
    variant?: 'primary' | 'secondary';
    children: any;
    onclick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  } = $props();

  const baseClass = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClass = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-gray-200 text-gray-900 hover:bg-gray-300';
</script>

<button class="{baseClass} {variantClass}" {onclick} {type} {disabled}>
  {@render children()}
</button>
