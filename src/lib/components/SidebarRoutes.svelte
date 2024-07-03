<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import {
		IconCloudComputing,
		IconFileInvoice,
		IconHelp,
		IconHome,
		IconSettings,
		IconShoppingCartCheck,
		IconWorldWww
	} from '@tabler/icons-svelte';

	const routes = [
		{
			icon: IconHome,
			label: 'Dashboard',
			href: '/dashboard',
			href2: 'filler'
		},
		{
			icon: IconCloudComputing,
			label: 'VPS',
			href: '/vps/list',
			href2: 'filler'
		},
		{
			icon: IconWorldWww,
			label: 'Webhosting',
			href: '/webhosting/list',
			href2: 'filler'
		},
		{
			icon: IconShoppingCartCheck,
			label: 'Orders',
			href: '/orders',
			href2: 'filler'
		},
		{
			icon: IconFileInvoice,
			label: 'Invoices',
			href: '/invoices',
			href2: 'filler'
		},
		{
			icon: IconHelp,
			label: 'Help',
			href: '/help',
			href2: 'filler'
		},
		{
			icon: IconSettings,
			label: 'Settings',
			href: '/settings/account',
			href2: '/settings'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, href2, icon, label }}
		<SidebarItem {href} {href2} {icon} {label} />
	{/each}
</div>
