<script lang="ts">
	import '../app.postcss';

	import Sidebar from '$lib/components/Sidebar.svelte';

	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer, Toast, Modal } from '@skeletonlabs/skeleton';

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Modal />

<Drawer position="left" regionDrawer="max-w-sm">
	<Sidebar />
</Drawer>

<Toast />

<div class="h-screen">
	<slot />
</div>
