<script lang="ts">
	import List from 'lucide-svelte/icons/list';
	import SidebarItem from './SidebarItem.svelte';
	import { HouseIcon } from 'lucide-svelte';

	const routes = [
		{
			icon: HouseIcon,
			label: 'Dashboard',
			href: '/dashboard'
		},
		{
			icon: List,
			label: 'VPS',
			href: '/vps/list'
		},
		{
			icon: List,
			label: 'Webhosting',
			href: '/webhosting/list'
		},
		{
			icon: List,
			label: 'Orders',
			href: '/orders'
		},
		{
			icon: List,
			label: 'Invoices',
			href: '/invoices'
		}
	];
</script>

<div class="flex w-full flex-col">
	{#each routes as { href, icon, label }}
		<SidebarItem href={`${href}`} {icon} {label} />
	{/each}
</div>
