<script lang="ts">
	import { page } from '$app/state';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newUser = $state(page.url.searchParams.get('new_user'));
	let loggedOut = $state(page.url.searchParams.get('logout'));
</script>

<LoginForm formSetup={data.form} />
