<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/form-schemas';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import CircleAlertIcon from '~icons/lucide/circle-alert';
	import MailWarning from '~icons/lucide/mail-warning';
	import Loader2 from '~icons/lucide/loader2';
	import { page } from '$app/stores';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { toast as sonner } from 'svelte-sonner';
	import autoAnimate from '@formkit/auto-animate';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let newUser = $state($page.url.searchParams.get('new_user'));
	let loggedOut = $state($page.url.searchParams.get('logout'));

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});
	const { form: formData, enhance, message, delayed } = form;

	let formElement: HTMLFormElement = $state();

	let totpCodeRequired: boolean = $state(false);

	message.subscribe((m) => {
		if (m) {
			if (m.status === 403 && m.message === 'Please verify your email') {
				sonner.info('Please verify your email');
			} else if (m.status === 400 && m.message === 'Invalid credentials') {
				sonner.error(m.message);
			} else if (m.status === 400 && m.message === 'Please enter your TOTP code') {
				sonner.info(m.message);

				totpCodeRequired = true;
				newUser = null;
				loggedOut = null;
				$formData.email = capturedFormData.email;
				$formData.password = capturedFormData.password;
				capturedFormData = { email: '', password: '' };
			} else if (m.status === 400 && m.message === 'Invalid TOTP code') {
				sonner.error(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});

	let capturedFormData = $state({
		email: '',
		password: ''
	});

	async function handleSubmit() {
		capturedFormData.email = $formData.email;
		capturedFormData.password = $formData.password;

		formElement.requestSubmit();
	}
</script>

<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-4">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Client-Login</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full" use:autoAnimate>
		{#if newUser}
			<div
				class="alert card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-outlined-surface-300-700 w-full mb-4"
			>
				<!-- Icon -->
				<div>
					<MailWarning class="size-4" />
				</div>
				<!-- Message -->
				<div class="alert-message">
					<p>Make sure to verify your email</p>
				</div>
			</div>
		{/if}
		{#if loggedOut}
			<div
				class="alert card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-outlined-success-300-700 w-full mb-4"
			>
				<div>
					<CircleAlertIcon class="size-4" />
				</div>
				<div class="alert-message">
					<p>You have been logged out</p>
				</div>
			</div>
		{/if}
		{#if totpCodeRequired}
			<div
				class="alert card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-outlined-warning-300-700 w-full mb-4"
			>
				<div>
					<CircleAlertIcon class="size-4" />
				</div>
				<div class="alert-message">
					<p>Additional authorization required</p>
				</div>
			</div>
		{/if}
		<form bind:this={formElement} method="post" use:enhance action="/login" class="w-full">
			<div class="space-y-4 md:space-y-6 mb-4">
				<div>
					<Field {form} name="email">
						<Control>
							{#snippet children({ props })}
								<div class="space-y-1">
									<Label>
										{#snippet child({ props })}
											<label {...props} class="label" for="email">
												<span class="label-text">Email</span>
											</label>
										{/snippet}
									</Label>
									<input
										{...props}
										bind:value={$formData.email}
										type="email"
										id="email"
										placeholder="name@example.com"
										class="input"
										tabindex="1"
									/>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				<div>
					<Field {form} name="password">
						<Control>
							{#snippet children({ props })}
								<div class="space-y-1">
									<Label>
										{#snippet child({ props })}
											<div class="flex items-center justify-between">
												<label {...props} for="password" class="label max-w-8">
													<span class="label-text">Password</span>
												</label>

												<a href="/reset-password" class="text-sm font-medium anchor" tabindex="5"
													>Forgot password?</a
												>
											</div>
										{/snippet}
									</Label>
									<input
										{...props}
										type="password"
										bind:value={$formData.password}
										id="password"
										class="input"
										placeholder="•••••••••••••"
										tabindex="2"
									/>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				{#if totpCodeRequired}
					<div>
						<Field {form} name="totp_code">
							<Control>
								{#snippet children({ props })}
									<div class="space-y-1">
										<Label>
											{#snippet child({ props })}
												<label {...props} class="label" for="totp_code">
													<span class="label-text">TOTP Code</span>
												</label>
											{/snippet}
										</Label>
										<input
											{...props}
											bind:value={$formData.totp_code}
											type="text"
											id="totp_code"
											placeholder="123456"
											class="input"
										/>
									</div>
								{/snippet}
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</div>
				{/if}
			</div>
		</form>

		<button class="w-full btn preset-filled" onclick={handleSubmit} tabindex="3">
			{#if $delayed}
				<Loader2 class="size-6 animate-spin" />
			{:else if totpCodeRequired}
				Submit
			{:else}
				Login
			{/if}
		</button>
		<div class="text-sm w-full text-center pt-2">
			Don't have an account yet? <a href="/register" class="font-medium anchor" tabindex="4"
				>Sign up</a
			>
		</div>
	</section>
</div>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Enter') handleSubmit();
	}}
/>
