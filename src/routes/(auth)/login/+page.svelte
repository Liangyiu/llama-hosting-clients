<script lang="ts">
	import { page } from '$app/state';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { onMount } from 'svelte';
	import { toast as sonner } from 'svelte-sonner';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		let newUser = $state(page.url.searchParams.get('new_user'));
		let loggedOut = $state(page.url.searchParams.get('logout'));

		if (newUser) {
			sonner.info('Please verify your email', {
				duration: 10000
			});
		}

		if (loggedOut) {
			sonner.warning('You have been signed out', {
				duration: 10000
			});
		}
	});
</script>

<LoginForm formSetup={data.form} />
