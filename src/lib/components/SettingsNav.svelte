<script lang="ts">
	import SettingsNavRoutes from './SettingsNavRoutes.svelte';
	import { activeSettingsSection } from '$lib/stores/stores.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
</script>

<div class="w-full h-fit">
	<div class="hidden md:flex">
		<SettingsNavRoutes />
	</div>
	<div class="md:hidden preset-ghost-surface rounded-t-lg w-full">
		<Accordion collapsible>
			<Accordion.Item value="settings" controlBase="h5 font-semibold">
				{#snippet control()}
					{$activeSettingsSection}
				{/snippet}
				{#snippet panel()}
					<SettingsNavRoutes />
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
</div>
