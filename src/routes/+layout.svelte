<script lang="ts">
	import '../app.postcss';

	import { ModeWatcher, mode } from 'mode-watcher';
	import type { Snippet } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<ModeWatcher />

<Toaster theme={$mode} position="bottom-center" />

<div class="h-screen">
	{@render children?.()}
</div>
