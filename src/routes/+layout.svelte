<script lang="ts">
	import '../app.postcss';

	import { ModeWatcher } from 'mode-watcher';
	// import { type ModalComponent } from '@skeletonlabs/skeleton';
	// import { initializeStores, Drawer, Toast, Modal } from '@skeletonlabs/skeleton';
	import { ToastProvider } from '@skeletonlabs/skeleton-svelte';
	import TotpCodeEntryModal from '$lib/components/Modals/TotpCodeEntryModal.svelte';
	import type { Snippet } from 'svelte';

	// initializeStores();

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	// const modalRegistry: Record<string, ModalComponent> = {
	// 	// Set a unique modal ID, then pass the component reference
	// 	totpEntryModal: { ref: TotpCodeEntryModal }
	// 	// ...
	// };
</script>

<ModeWatcher />

<!-- <Modal components={modalRegistry} /> -->

<ToastProvider>
	<div class="h-screen">
		{@render children?.()}
	</div>
</ToastProvider>
