<script lang="ts">
	import List from 'lucide-svelte/icons/list';
	import SidebarItem from './SidebarItem.svelte';
	import { HouseIcon } from 'lucide-svelte';
	import {
		IconCloudComputing,
		IconFileInvoice,
		IconHelp,
		IconHome,
		IconList,
		IconSettings,
		IconShoppingCartCheck,
		IconWorldWww
	} from '@tabler/icons-svelte';

	const routes = [
		{
			icon: IconHome,
			label: 'Dashboard',
			href: '/dashboard'
		},
		{
			icon: IconCloudComputing,
			label: 'VPS',
			href: '/vps/list'
		},
		{
			icon: IconWorldWww,
			label: 'Webhosting',
			href: '/webhosting/list'
		},
		{
			icon: IconShoppingCartCheck,
			label: 'Orders',
			href: '/orders'
		},
		{
			icon: IconFileInvoice,
			label: 'Invoices',
			href: '/invoices'
		},
		{
			icon: IconHelp,
			label: 'Help',
			href: '/help'
		},
		{
			icon: IconSettings,
			label: 'Settings',
			href: '/settings'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, icon, label }}
		<SidebarItem href={`${href}`} {icon} {label} />
	{/each}
</div>
