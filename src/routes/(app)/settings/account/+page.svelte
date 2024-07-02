<script>
	import { page } from '$app/stores';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<Breadcrumbs pathname={$page.url.pathname} />

Account settings
