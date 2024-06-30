<script lang="ts">
	import '../app.postcss';

	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/components/Sidebar.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Drawer position="left" regionDrawer="max-w-sm">
	<Sidebar />
</Drawer>

<div class="h-screen">
	<slot />
</div>
