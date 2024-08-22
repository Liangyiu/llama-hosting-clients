<script lang="ts">
	import { getUserState } from '$lib/stores/userStore';
	import { page } from '$app/stores';
	import { IconCheck } from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';

	$: pwReset = $page.url.searchParams.get('passwordReset') === 'true';

	const user = getUserState();
</script>

<div class="w-full">
	<div>
		<h4 class="h4 hidden md:block">Security</h4>
	</div>

	<div class="md:py-6 py-4 space-y-8 md:space-y-14">
		<section class="space-y-4">
			<h5 class="h5">2FA/TOTP</h5>
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form action="/settings/security/?/activate2fa" method="post" use:enhance>
					<input class="hidden" type="text" name="email" id="email" bind:value={$user.email} />
					<button type="submit" class="btn variant-soft-error w-full">Reset password</button>
				</form>
			</div>
		</section>
		<section class="space-y-4">
			<h5 class="h5">Password</h5>
			{#if pwReset}
				<aside class="alert variant-soft-success w-full mb-4">
					<div>
						<IconCheck class="size-4" />
					</div>
					<div class="alert-message">
						<p>
							Success! <br class="md:hidden" />Password reset instructions have been sent to your
							email.
						</p>
					</div>
				</aside>
			{/if}
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form action="/settings/security/?/resetPassword" method="post" use:enhance>
					<input class="hidden" type="text" name="email" id="email" bind:value={$user.email} />
					<button type="submit" class="btn variant-soft-error w-full">Reset password</button>
				</form>
			</div>
		</section>
	</div>
</div>
