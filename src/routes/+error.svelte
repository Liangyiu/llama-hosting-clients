<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="text-center space-y-4 lg:space-y-8 content-center mx-auto h-full px-2">
	{#if $page.status === 404}
		<div class="text-9xl font-extrabold text-error-300-600-token">404</div>
		<div class="text-4xl font-bold">You have found a secret place</div>
		<p>
			Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
			been moved to another URL.
		</p>

		<a href="/" class="btn variant-filled">Take me to the home page</a>
	{:else}
		<div class="text-9xl font-extrabold text-error-300-600-token">{$page.status}</div>
		<p>Whoops, looks like something went wrong.</p>
		<p>We are working on it</p>
	{/if}

	{#if $page.error?.errorId}
		<p>Error ID: {$page.error.errorId}</p>
	{/if}
</div>
