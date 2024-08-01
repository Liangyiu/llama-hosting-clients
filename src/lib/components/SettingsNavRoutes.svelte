<script lang="ts">
	import SettingsNavItem from './SettingsNavItem.svelte';

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
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, label }}
		<SettingsNavItem {href} {label} />
	{/each}
</div>
