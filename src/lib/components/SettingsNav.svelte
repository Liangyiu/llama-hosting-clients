<script lang="ts">
	import { page } from '$app/stores';
	import SettingsNavRoutes from './SettingsNavRoutes.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	const routes = [
		{
			label: 'Account',
			href: '/settings/account'
		},
		{
			label: 'Security',
			href: '/settings/security'
		},
		{
			label: 'SSH Key Vault',
			href: '/settings/ssh-key-vault'
		}
	];

	let opened = $state(['']);
	let activeSection = $state(routes.find((r) => r.href === $page.url.pathname));

	function itemClicked(item: { label: string; href: string }) {
		activeSection = item;

		opened = [''];
	}
</script>

<div class="w-full h-fit">
	<div class="hidden md:flex">
		<SettingsNavRoutes {routes} {itemClicked} />
	</div>
	<div class="md:hidden preset-outlined-surface-500 rounded-t-lg w-full">
		<Accordion bind:value={opened} collapsible>
			<Accordion.Item
				value="settings"
				controlBase="settings-accordion h5 font-semibold w-full flex items-center justify-between"
				controlHover="hover:text-secondary-600-400 hover:bg-surface-hover"
			>
				{#snippet control()}
					{activeSection?.label || 'Account'}
				{/snippet}
				{#snippet panel()}
					<SettingsNavRoutes {routes} {itemClicked} />
				{/snippet}
			</Accordion.Item>
		</Accordion>
	</div>
</div>
