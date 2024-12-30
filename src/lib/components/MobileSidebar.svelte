<script lang="ts">
	import MenuIcon from '~icons/lucide/menu';

	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import Sidebar from './Sidebar.svelte';
	import { createSidebarStore } from '$lib/stores/SideBarStore.svelte';

	const drawerStore = createSidebarStore();
</script>

<!-- Mobile Drawer -->
<Modal
	bind:open={drawerStore.visible}
	triggerBase="btn-icon lg:hidden "
	contentBase="bg-surface-100-900 p-4 space-y-4 shadow-xl w-[300px] h-screen"
	positionerJustify="justify-start"
	positionerAlign=""
	positionerPadding=""
	transitionsPositionerIn={{ x: -480, duration: 200 }}
	transitionsPositionerOut={{ x: -480, duration: 200 }}
>
	{#snippet trigger()}
		<MenuIcon />
	{/snippet}

	{#snippet content()}
		<Sidebar />
	{/snippet}
</Modal>
