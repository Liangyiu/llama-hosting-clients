<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import SettingsNavRoutes from './SettingsNavRoutes.svelte';
	import { activeSettingsSection } from '$lib/stores/stores';
</script>

<div class="w-full h-fit">
	<div class="hidden md:flex">
		<SettingsNavRoutes />
	</div>
	<div class="md:hidden variant-ghost-surface rounded-t-lg w-full">
		<Accordion>
			<AccordionItem id="settings-accordion" regionControl="h5 font-semibold">
				<svelte:fragment slot="summary">{$activeSettingsSection}</svelte:fragment>
				<svelte:fragment slot="content">
					<SettingsNavRoutes />
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
</div>
