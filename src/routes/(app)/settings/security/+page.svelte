<script lang="ts">
	import { getUserState } from '$lib/stores/userStore';
	import { page } from '$app/stores';
	import { IconCheck } from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { activateTotpSchema, deactivateTotpSchema } from '$lib/form-schemas.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Control, Field } from 'formsnap';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ActivateTotpModal from '$lib/components/Modals/ActivateTotpModal.svelte';
	import TotpCodeEntryModal from '$lib/components/Modals/TotpCodeEntryModal.svelte';

	const modalStore = getModalStore();

	export let data;

	const { activateTotp, deactivateTotp } = data;

	const deactivateTotpForm = superForm(deactivateTotp, {
		validators: zodClient(deactivateTotpSchema)
	});

	const {
		form: deactivateTotpFormData,
		enhance: deactivateTotpFormEnhance,
		message: deactivateTotpFormMessage,
		delayed: deactivateTotpFormDelayed
	} = deactivateTotpForm;

	$: pwReset = $page.url.searchParams.get('passwordReset') === 'true';

	const user = getUserState();

	async function showActivateTotp() {
		const modalComponent: ModalComponent = {
			ref: ActivateTotpModal
		};

		const modalResponse = await new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: modalComponent,
				response(r: boolean) {
					resolve(r);
				},
				meta: {
					activateTotp,
					user: $user
				}
			};
			modalStore.trigger(modal);
		});

		if (modalResponse) {
			$user.mfaTotp = true;
		}
	}

	async function showTotpTokenCheck() {
		const modalComponent: ModalComponent = {
			ref: TotpCodeEntryModal
		};

		const modalResponse = await new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: modalComponent,
				response(r: boolean) {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

		if (modalResponse) {
			$user.mfaTotp = false;
			$user.mfaTotpSecretId = undefined;
		}
	}
</script>

<div class="w-full">
	<div>
		<h4 class="h4 hidden md:block">Security</h4>
	</div>

	<div class="md:py-6 py-4 space-y-8 md:space-y-14">
		<section class="space-y-4">
			<h5 class="h5">2FA/TOTP</h5>
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				{#if $user.mfaTotp}
					<div>
						<button on:click={showTotpTokenCheck} class="btn variant-soft-error w-full"
							>Deactivate 2FA/TOTP</button
						>
					</div>
				{:else}
					<div>
						<button on:click={showActivateTotp} class="btn variant-soft-success w-full"
							>Activate 2FA/TOTP</button
						>
					</div>
				{/if}
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
