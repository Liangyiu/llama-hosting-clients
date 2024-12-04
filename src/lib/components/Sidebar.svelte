<script lang="ts">
	import SidebarRoutes from './SidebarRoutes.svelte';
</script>

<div
	class="flex h-full flex-col overflow-y-auto lg:border-r-2 border-surface-300-700 preset-glass-surface shadow-sm"
>
	<div class="p-3">
		<a href="/">
			<img
				src="/assets/logos/llama-hosting-logo-light-text.svg"
				alt="llama-hosting-logo-with-text"
				class="hidden h-14 dark:block"
			/>
			<img
				src="/assets/logos/llama-hosting-logo-dark-text.svg"
				alt="llama-hosting-logo-with-text"
				class="block h-14 dark:hidden"
			/>
		</a>
	</div>
	<div class="flex w-full flex-col p-6">
		<SidebarRoutes />
	</div>
</div>
