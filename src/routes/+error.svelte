<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-center space-y-4 lg:space-y-8 content-center mx-auto h-full px-2">
	{#if page.status === 404}
		<div class="text-9xl font-extrabold text-error-300-700">404</div>
		<div class="text-4xl font-bold">You have found a secret place</div>
		<p>
			Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
			been moved to another URL.
		</p>

		<a href="/" class="btn preset-filled">Take me to the home page</a>
	{:else if page.status === 401}
		<div class="text-9xl font-extrabold text-error-300-700">{page.status}</div>
		<div class="text-4xl font-bold">You are not allowed to access this page.</div>
	{:else}
		<div class="text-9xl font-extrabold text-error-300-700">{page.status}</div>
		<p>Whoops, looks like something went wrong.</p>
		<p>We are working on it</p>
	{/if}

	{#if page.error?.errorId}
		<p>Error ID: {page.error.errorId}</p>
	{/if}
</div>
