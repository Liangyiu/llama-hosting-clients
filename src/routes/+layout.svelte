<script lang="ts">
	import '../app.postcss';

	import Sidebar from '$lib/components/Sidebar.svelte';

	import { autoModeWatcher, type ModalComponent } from '@skeletonlabs/skeleton';
	import { initializeStores, Drawer, Toast, Modal } from '@skeletonlabs/skeleton';

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import TotpCodeEntryModal from '$lib/components/Modals/TotpCodeEntryModal.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		totpEntryModal: { ref: TotpCodeEntryModal }
		// ...
	};
</script>

<svelte:head>{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}</svelte:head>

<Modal components={modalRegistry} />

<Drawer position="left" regionDrawer="max-w-sm">
	<Sidebar />
</Drawer>

<Toast />

<div class="h-screen">
	{@render children?.()}
</div>
