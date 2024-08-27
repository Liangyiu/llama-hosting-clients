<script lang="ts">
	import { getUserState } from '$lib/stores/userStore';
	import { page } from '$app/stores';
	import { IconCheck } from '@tabler/icons-svelte';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { activateTotpSchema, deactivateTotpSchema } from '$lib/form-schemas.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		getToastStore,
		getModalStore,
		type ModalComponent,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import ActivateTotpModal from '$lib/components/Modals/ActivateTotpModal.svelte';
	import { Control, Field, FieldErrors } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

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

	let deactivateTotpFormElement: HTMLFormElement;
	let totpCodeInput: HTMLInputElement;

	deactivateTotpFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				$user.mfaTotp = false;
				$user.mfaTotpSecretId = undefined;

				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-success',
					timeout: 5000
				};

				toastStore.trigger(toastConfig);
			} else if (m.status === 429) {
				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-error',
					timeout: 8000
				};

				toastStore.trigger(toastConfig);
			} else if (m.status === 498) {
				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-error',
					timeout: 8000
				};

				toastStore.trigger(toastConfig);
			} else {
				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-error',
					autohide: false
				};

				toastStore.trigger(toastConfig);
			}
		}
	});

	$: pwReset = $page.url.searchParams.get('passwordReset') === 'true';

	const user = getUserState();

	async function showActivateTotpModal() {
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

	interface TotpModalResponse {
		confirmed: boolean;
		totp_code: string;
	}

	export async function showTotpEntryModal() {
		const modalResponse = new Promise<TotpModalResponse>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: 'totpEntryModal',
				response(r: TotpModalResponse) {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

		return modalResponse;
	}

	async function showTotpTokenCheck() {
		const { confirmed, totp_code } = await showTotpEntryModal();

		if (confirmed) {
			totpCodeInput.value = totp_code;
			$deactivateTotpFormData.totp_code = totp_code;
			deactivateTotpFormElement.requestSubmit();
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
						<button on:click={showTotpTokenCheck} class="btn variant-soft-error w-full">
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
						<button on:click={showActivateTotpModal} class="btn variant-soft-success w-full"
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
