<script lang="ts">
	import { getUserState } from '$lib/stores/UserStore.svelte.js';
	import { page } from '$app/stores';
	import { IconCheck } from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { activateTotpSchema, deactivateTotpSchema } from '$lib/form-schemas.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	// import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ActivateTotpModal from '$lib/components/Modals/ActivateTotpModal.svelte';
	import { Control, Field, FieldErrors } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';

	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	const toast: ToastContext = getContext('toast');

	// const modalStore = getModalStore();

	let { data } = $props();

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

	let deactivateTotpFormElement: HTMLFormElement = $state();
	let totpCodeInput: HTMLInputElement = $state();

	deactivateTotpFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				user.mfaTotp = false;
				user.mfaTotpSecretId = undefined;

				toast.create({
					title: 'Success',
					description: m.message,
					type: 'success',
					duration: 5000
				});
			} else if (m.status === 429) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else if (m.status === 498) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 15000
				});
			}
		}
	});

	let pwReset = $derived($page.url.searchParams.get('passwordReset') === 'true');

	const user = getUserState();

	// async function showActivateTotpModal() {
	// 	const modalComponent: ModalComponent = {
	// 		ref: ActivateTotpModal
	// 	};

	// 	const modalResponse = await new Promise<boolean>((resolve) => {
	// 		const modal: ModalSettings = {
	// 			type: 'component',
	// 			component: modalComponent,
	// 			response(r: boolean) {
	// 				resolve(r);
	// 			},
	// 			meta: {
	// 				activateTotp,
	// 				user: user
	// 			}
	// 		};
	// 		modalStore.trigger(modal);
	// 	});

	// 	if (modalResponse) {
	// 		user.mfaTotp = true;
	// 	}
	// }

	interface TotpModalResponse {
		confirmed: boolean;
		totp_code: string;
	}

	// export async function showTotpEntryModal() {
	// 	const modalResponse = new Promise<TotpModalResponse>((resolve) => {
	// 		const modal: ModalSettings = {
	// 			type: 'component',
	// 			component: 'totpEntryModal',
	// 			response(r: TotpModalResponse) {
	// 				resolve(r);
	// 			}
	// 		};
	// 		modalStore.trigger(modal);
	// 	});

	// 	return modalResponse;
	// }

	async function showTotpTokenCheck() {
		// const { confirmed, totp_code } = await showTotpEntryModal();
		// if (confirmed) {
		// 	totpCodeInput.value = totp_code;
		// 	$deactivateTotpFormData.totp_code = totp_code;
		// 	deactivateTotpFormElement.requestSubmit();
		// }
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
				{#if user.mfaTotp}
					<div>
						<button onclick={showTotpTokenCheck} class="btn preset-filled-error-300-700 w-full">
							{#if $deactivateTotpFormDelayed}
								<Loader2 class="size-6 animate-spin" />
							{:else}
								Deactivate 2FA/TOTP
							{/if}
						</button>
					</div>

					<div>
						<form
							bind:this={deactivateTotpFormElement}
							action="/settings/security/?/deactivateTotp"
							method="post"
							use:deactivateTotpFormEnhance
						>
							<Field form={deactivateTotpForm} name="totp_code">
								<Control>
									<input
										bind:this={totpCodeInput}
										type="text"
										name="totp_code"
										class="hidden"
										bind:value={$deactivateTotpFormData.totp_code}
									/>
								</Control>
								<FieldErrors class="text-error-500" />
							</Field>
						</form>
					</div>
				{:else}
					<div>
						<!-- onclick={showActivateTotpModal} -->
						<button class="btn preset-filled-primary-300-700 w-full">Activate 2FA/TOTP</button>
					</div>
				{/if}
			</div>
		</section>
		<section class="space-y-4">
			<h5 class="h5">Password</h5>
			{#if pwReset}
				<div
					class="card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-soft-success w-full mb-4"
				>
					<div>
						<IconCheck class="size-4" />
					</div>
					<div class="alert-message">
						<p class="font-bold">Success!</p>
						<p class="type-scale-1 opacity-60">
							Success! <br class="md:hidden" />Password reset instructions have been sent to your
							email.
						</p>
					</div>
				</div>
			{/if}
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form action="/settings/security/?/resetPassword" method="post" use:enhance>
					<input class="hidden" type="text" name="email" id="email" bind:value={user.email} />
					<button type="submit" class="btn preset-outlined-error-300-700 w-full"
						>Reset password</button
					>
				</form>
			</div>
		</section>
	</div>
</div>
