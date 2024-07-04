<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';

	export let data;

	const { user, avatarUrl } = data;
</script>

<div class="h-full">
	<Navigation {user} {avatarUrl} />

	<main class="h-screen pt-[80px] lg:pl-56">
		<div class="p-4 mx-auto max-w-[1450px] border h-full">
			<slot />
		</div>
	</main>
</div>
