<script lang="ts">
	import '../app.postcss';

	import { ModeWatcher, mode } from 'mode-watcher';
	// import { type ModalComponent } from '@skeletonlabs/skeleton';
	// import { initializeStores, Drawer, Modal } from '@skeletonlabs/skeleton';
	import TotpCodeEntryModal from '$lib/components/Modals/TotpCodeEntryModal.svelte';
	import type { Snippet } from 'svelte';
	import { Toaster } from 'svelte-sonner';

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

<Toaster theme={$mode} position="bottom-center" />

<div class="h-screen">
	{@render children?.()}
</div>
