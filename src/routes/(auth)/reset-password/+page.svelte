<script lang="ts">
	import PwResetForm from '$lib/components/PwResetForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PwResetForm formSetup={data.form} />
