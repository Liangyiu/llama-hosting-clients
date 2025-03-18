<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';

	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { dev } from '$app/environment';
	import { RenderScan } from 'svelte-render-scan';

	let { children } = $props();
</script>

<ModeWatcher />

{#if dev}
	<RenderScan />
{/if}

<Toaster position="bottom-center" richColors />

<div class="h-screen">
	{@render children()}
</div>
