<script lang="ts">
	import IconCheck from '~icons/tabler/check';
	import { getUserState } from '$lib/stores/UserStore.svelte.js';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { activateTotpSchema, deactivateTotpSchema } from '$lib/form-schemas.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import Loader2 from '~icons/lucide/loader2';

	import { toast as sonner } from 'svelte-sonner';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { Secret, TOTP } from 'otpauth';
	import QRCode from '@castlenine/svelte-qrcode';
	import autoAnimate from '@formkit/auto-animate';
	import TotpInputModal from '$lib/components/Modals/TotpInputModal.svelte';
	import { goto } from '$app/navigation';

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

	const activateTotpForm = superForm(activateTotp, {
		validators: zodClient(activateTotpSchema)
	});

	const {
		form: activateTotpFormData,
		enhance: activateTotpFormEnhance,
		message: activateTotpFormMessage,
		delayed: activateTotpFormDelayed
	} = activateTotpForm;

	let activateTotpFormElement: HTMLFormElement | undefined = $state();
	let deactivateTotpFormElement: HTMLFormElement | undefined = $state();

	let secretInputElement: HTMLInputElement | undefined = $state();

	activateTotpFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				user.mfaTotp = true;
				sonner.success(m.message);
			} else if (m.status === 400) {
				sonner.error(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});

	deactivateTotpFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				user.mfaTotp = false;
				user.mfaTotpSecretId = undefined;

				sonner.success(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else if (m.status === 498) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});

	let pwReset = $derived($page.url.searchParams.get('passwordReset') === 'true');

	const user = getUserState();

	const totpSecret = new Secret({ size: 32 });

	const totp = new TOTP({
		issuer: 'llama hosting',
		label: user.email,
		secret: totpSecret,
		digits: 6,
		period: 30,
		algorithm: 'SHA1'
	});

	let openState = $state(false);

	let modalSettings = $state<{
		action: 'activateTotp' | 'deactivateTotp' | undefined;
		title: string | undefined;
		description: string | undefined;
	}>({
		action: undefined,
		title: undefined,
		description: undefined
	});

	function showConfirmModal() {
		openState = true;
	}

	function handleModalCancellation() {
		openState = false;
		modalSettings.action = undefined;
		modalSettings.title = undefined;
		modalSettings.description = undefined;
	}

	async function handleModalConfirm() {
		switch (modalSettings.action) {
			case 'activateTotp':
				if (secretInputElement) {
					secretInputElement.value = totpSecret.base32;
				}
				activateTotpFormElement?.requestSubmit();
				openState = false;
				break;
			case 'deactivateTotp':
				deactivateTotpFormElement?.requestSubmit();
				openState = false;
				break;
		}
	}

	let showTotpEntryModal = $state(false);
	let totpCode = $state('');
	let pwResetLoading = $state(false);

	async function handlePwResetBtnPress() {
		if (user.mfaTotp) {
			showTotpEntryModal = true;
		} else {
			await handlePwReset();
		}
	}

	async function handlePwReset() {
		pwResetLoading = true;
		const response = await fetch('/api/account/password-reset', {
			method: 'POST',
			body: JSON.stringify({
				totpCode
			})
		});

		if (response.ok) {
			pwResetLoading = false;
			showTotpEntryModal = false;
			totpCode = '';

			goto('/settings/security?passwordReset=true');
		} else {
			const { message } = await response.json();
			pwResetLoading = false;

			sonner.error(message);
		}
	}
</script>

<Modal
	bind:open={openState}
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<header class="flex justify-between">
			<h3 class="h3">
				{#if modalSettings.action === 'activateTotp'}
					Activate 2FA/TOTP
				{:else if modalSettings.action === 'deactivateTotp'}
					Deactivate 2FA/TOTP
				{/if}
			</h3>
		</header>
		<article>
			<!-- <p class="opacity-60"> -->
			{#if modalSettings.action === 'activateTotp'}
				<article>
					Scan the QR code below or enter the secret into your preferred authenticator app.
				</article>

				<div class="border border-surface-500 p-4 space-y-4 rounded-container">
					<div class="flex-row justify-center space-y-4 p-4">
						<div class="flex justify-center">
							<QRCode data={totp.toString()} />
						</div>
						<div class="text-center">
							Secret
							<textarea
								class="textarea preset-outlined-surface-400-600 text-sm text-center"
								readonly
								rows="1"
								bind:value={totpSecret.base32}
							></textarea>
						</div>
					</div>
					<hr class="hr" />
					<form
						bind:this={activateTotpFormElement}
						class="p-4"
						action="/settings/security/?/activateTotp"
						method="post"
						use:activateTotpFormEnhance
					>
						<Field form={activateTotpForm} name="totp_secret">
							<Control>
								<input
									bind:this={secretInputElement}
									type="text"
									class="hidden"
									name="totp_secret"
									bind:value={$activateTotpFormData.totp_secret}
								/>
							</Control>
						</Field>
						<Field form={activateTotpForm} name="totp_code">
							<Control>
								{#snippet children({ props })}
									<Label>
										{#snippet child({ props })}
											<label {...props} class="label sr-only" for="totp_code">
												<span>Code</span>
											</label>
										{/snippet}
									</Label>
									<input
										{...props}
										class="input"
										type="text"
										name="totp_code"
										id="totp_code"
										bind:value={$activateTotpFormData.totp_code}
										placeholder="Enter TOTP Code"
									/>
								{/snippet}
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</form>
				</div>
			{:else if modalSettings.action === 'deactivateTotp'}
				<div class="opacity-60">
					<p class="mb-4">Enter your TOTP code to deactivate 2FA.</p>
					<form
						bind:this={deactivateTotpFormElement}
						action="/settings/security/?/deactivateTotp"
						method="post"
						use:deactivateTotpFormEnhance
					>
						<Field form={deactivateTotpForm} name="totp_code">
							<Control>
								{#snippet children({ props })}
									<Label>
										{#snippet child({ props })}
											<label {...props} class="label" for="totp_code">
												<span>Code</span>
											</label>
										{/snippet}
									</Label>
									<input
										{...props}
										type="text"
										name="totp_code"
										class="input"
										placeholder="••••••"
										bind:value={$deactivateTotpFormData.totp_code}
									/>
								{/snippet}
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</form>
				</div>
			{/if}
		</article>
		<footer class="flex justify-end gap-4">
			<button type="button" class="btn preset-tonal" onclick={handleModalCancellation}
				>Cancel</button
			>
			<button type="button" class="btn preset-filled" onclick={handleModalConfirm}>
				{#if $activateTotpFormDelayed || $deactivateTotpFormDelayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Confirm
				{/if}
			</button>
		</footer>
	{/snippet}
</Modal>

<TotpInputModal
	bind:open={showTotpEntryModal}
	bind:totpCode
	bind:loading={pwResetLoading}
	confirmPressed={handlePwReset}
/>

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
						<button
							onclick={() => {
								modalSettings.action = 'deactivateTotp';
								modalSettings.title = 'Deactivate 2FA/TOTP';
								showConfirmModal();
							}}
							class="btn preset-filled-error-300-700 w-full"
						>
							{#if $deactivateTotpFormDelayed}
								<Loader2 class="size-6 animate-spin" />
							{:else}
								Deactivate 2FA/TOTP
							{/if}
						</button>
					</div>
				{:else}
					<div>
						<button
							class="btn preset-filled-primary-300-700 w-full"
							onclick={() => {
								modalSettings.action = 'activateTotp';
								modalSettings.title = 'Activate 2FA/TOTP';
								showConfirmModal();
							}}>Activate 2FA/TOTP</button
						>
					</div>
				{/if}
			</div>
		</section>
		<section class="space-y-4" use:autoAnimate>
			<h5 class="h5">Password</h5>
			{#if pwReset}
				<div
					class="card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-outlined-success-500 mb-4 max-w-xl"
				>
					<IconCheck class="size-4" />

					<div class="alert-message">
						<p class="font-bold">Success!</p>
						<p class="type-scale-1 opacity-60">
							Password reset instructions have been sent to your email.
						</p>
					</div>
				</div>
			{/if}
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-fit">
				<button class="btn preset-outlined-error-300-700 w-full" onclick={handlePwResetBtnPress}
					>Reset password</button
				>
			</div>
		</section>
	</div>
</div>
