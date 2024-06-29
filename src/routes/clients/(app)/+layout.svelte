<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';

	export let data;

	const { user } = data;
</script>

<div class="h-full">
	<Navigation {user} />

	<main class="h-screen pt-[80px] md:pl-56">
		<div class="p-5">
			<slot />
		</div>
	</main>
</div>
