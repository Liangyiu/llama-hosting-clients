<script lang="ts">
	import '../app.postcss';

	import { ModeWatcher } from 'mode-watcher';
	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/components/Sidebar.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Drawer position="left" regionDrawer="max-w-sm">
	<Sidebar />
</Drawer>

<ModeWatcher defaultMode={'dark'} />

<div class="h-screen">
	<slot />
</div>
