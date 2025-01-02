<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import Loader2 from '~icons/lucide/loader2';

	interface Props {
		confirmPressed: () => void;
		open: boolean;
		totpCode: string;
		loading?: boolean;
	}

	let {
		open = $bindable(),
		totpCode = $bindable(),
		loading = $bindable(),
		confirmPressed
	}: Props = $props();

	function closeModal() {
		open = false;
		totpCode = '';
	}
</script>

<Modal
	bind:open
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			<h3 class="h3">Confirm action</h3>
		</header>
		<article>
			<div class="opacity-60">
				<p class="mb-4">Enter your TOTP code to confirm.</p>
				<input
					type="text"
					name="totp_code"
					class="input"
					placeholder="••••••"
					bind:value={totpCode}
				/>
			</div>
		</article>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={closeModal}>Cancel</button>
			<button type="button" class="btn preset-filled" onclick={() => confirmPressed()}>
				{#if loading}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Confirm
				{/if}
			</button>
		</footer>
	{/snippet}
</Modal>
