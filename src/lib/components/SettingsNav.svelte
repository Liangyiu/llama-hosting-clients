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
				{#snippet summary()}
								{$activeSettingsSection}
							{/snippet}
				{#snippet content()}
							
						<SettingsNavRoutes />
					
							{/snippet}
			</AccordionItem>
		</Accordion>
	</div>
</div>
