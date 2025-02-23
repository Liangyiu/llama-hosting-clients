<script lang="ts">
	import { ModeWatcher, mode } from 'mode-watcher';

	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	let { children } = $props();
</script>

<ModeWatcher />

<Toaster position="bottom-center" richColors />

<div class="h-screen">
	{@render children()}
</div>
