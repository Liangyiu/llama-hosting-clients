<script lang="ts">
	import RegisterForm from '$lib/components/RegisterForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { form } = data;
</script>

<RegisterForm formSetup={form} />
