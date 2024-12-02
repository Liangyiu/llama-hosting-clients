<!-- <script lang="ts">
	import { getContext, type SvelteComponent } from 'svelte';
	import QRCode from '@castlenine/svelte-qrcode';

	// import { getModalStore } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { activateTotpSchema } from '$lib/form-schemas';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { Secret, TOTP } from 'otpauth';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		// expose parent props to comp
		parent: SvelteComponent;
	}

	let { parent }: Props = $props();

	const toast: ToastContext = getContext('toast');

	// const modalStore = getModalStore();

	const TotpSecret = new Secret({ size: 32 });

	// const totp = new TOTP({
	// 	issuer: 'llama hosting',
	// 	label: $modalStore[0].meta.user.email,
	// 	secret: TotpSecret,
	// 	digits: 6,
	// 	period: 30,
	// 	algorithm: 'SHA1'
	// });

	// const { activateTotp } = $modalStore[0].meta;

	// const activateTotpForm = superForm(activateTotp, {
	// 	validators: zodClient(activateTotpSchema)
	// });

	const { form: formData, enhance, message, delayed } = activateTotpForm;

	message.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				toast.create({
					title: 'Success',
					description: m.message,
					type: 'success',
					duration: 5000
				});

				// if ($modalStore[0].response) {
				// 	$modalStore[0].response(true);
				// }

				// modalStore.close();
			} else if (m.status === 400) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 5000
				});
			} else if (m.status === 429) {
				//TODO: handle rate limit
			} else {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 5000
				});
			}
		}
	});

	// Form Element
	let formElement: HTMLFormElement = $state();
	let secretInput: HTMLInputElement = $state();

	// custom form submit function
	// function onFormSubmit(): void {
	// 	if ($modalStore[0].response) {
	// 		secretInput.value = TotpSecret.base32;
	// 		formElement.requestSubmit();
	// 	}
	// }

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- {#if $modalStore[0]}
	<div class="modal-activate-totp {cBase}">
		<header class={cHeader}>Activate 2FA/TOTP</header>
		<article>
			Scan the QR code below or enter the secret into your preferred authenticator app.
		</article>

		<div class="border border-surface-500 p-4 space-y-4 rounded-container">
			<div class="flex-row justify-center space-y-4 p-4">
				<div class="flex justify-center">
					<QRCode data={totp.toString()} />
				</div>
				<div class="text-center overflow-scroll">
					<p>Secret: {TotpSecret.base32}</p>
				</div>
			</div>
			<hr class="hr" />
			<form
				class="p-4"
				bind:this={formElement}
				action="/settings/security/?/activateTotp"
				method="post"
				use:enhance
			>
				<Field form={activateTotpForm} name="totp_secret">
					<Control>
						<input
							bind:this={secretInput}
							type="text"
							class="hidden"
							name="totp_secret"
							bind:value={$formData.totp_secret}
						/>
					</Control>
				</Field>
				<Field form={activateTotpForm} name="totp_code">
					<Control let:attrs>
						<Label asChild={true}>
							<label class="label sr-only" for="totp_code">
								<span>Code</span>
							</label>
						</Label>
						<input
							{...attrs}
							class="input"
							type="text"
							name="totp_code"
							id="totp_code"
							bind:value={$formData.totp_code}
							placeholder="Enter TOTP Code"
						/>
					</Control>
					<FieldErrors class="text-error-500" />
				</Field>
			</form>
		</div>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" onclick={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
	</div>
{/if}-->
-->
