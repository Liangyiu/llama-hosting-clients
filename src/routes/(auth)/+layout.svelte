<script lang="ts">
</script>

<main class="mx-auto h-screen w-full max-w-lg content-center items-center space-y-4 p-4">
	<div class="logo-section flex w-full items-center justify-center">
		<a href="/">
			<img
				src="/assets/logos/llama-hosting-logo-light-text.svg"
				alt="llama-hosting-logo-with-text"
				class="hidden h-14 dark:block"
			/>
			<img
				src="/assets/logos/llama-hosting-logo-dark-text.svg"
				alt="llama-hosting-logo-with-text"
				class="block h-14 dark:hidden"
			/>
		</a>
	</div>

	<div class="shadow-lg">
		<slot />
	</div>
</main>
