<script lang="ts">
	import { focusTrap } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/form-schemas';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { CircleAlertIcon, Loader2, MailWarning } from 'lucide-svelte';
	import { page } from '$app/stores';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { getContext } from 'svelte';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

	const toast: ToastContext = getContext('toast');

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let newUser = $page.url.searchParams.get('new_user');
	let loggedOut = $page.url.searchParams.get('logout');

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});
	const { form: formData, enhance, message, delayed } = form;

	let formElement: HTMLFormElement = $state();

	let isFocused: boolean = true;

	let totpCodeRequired: boolean = $state(false);

	message.subscribe((m) => {
		if (m) {
			if (m.status === 403 && m.message === 'Please verify your email') {
				toast.create({
					title: 'Info',
					description: 'Please verify your email',
					type: 'info',
					duration: 15000
				});
			} else if (m.status === 400 && m.message === 'Invalid credentials') {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else if (m.status === 400 && m.message === 'Please enter your TOTP code') {
				totpCodeRequired = true;
				$formData.email = capturedFormData.email;
				$formData.password = capturedFormData.password;
				capturedFormData = { email: '', password: '' };
			} else if (m.status === 400 && m.message === 'Invalid TOTP code') {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else if (m.status === 429) {
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
					duration: 8000
				});
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

<div class="card">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Client-Login</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		{#if newUser}
			<div
				class="card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-ghost w-full mb-4"
			>
				<!-- Icon -->
				<div>
					<MailWarning class="size-4" />
				</div>
				<!-- Message -->
				<div class="alert-message">
					<p class="font-bold">Info</p>
					<p class="type-scale-1 opacity-60">Make sure to verify your email</p>
				</div>
			</div>
		{/if}
		{#if loggedOut}
			<div
				class="card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-soft-success w-full mb-4"
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
				class="card grid grid-cols-1 items-center gap-4 p-4 lg:grid-cols-[auto_1fr_auto] preset-soft-warning w-full mb-4"
			>
				<div>
					<CircleAlertIcon class="size-4" />
				</div>
				<div class="alert-message">
					<p class="font-bold">Info</p>
					<p class="type-scale-1 opacity-60">Additional authorization required</p>
				</div>
			</div>
		{/if}
		<form
			bind:this={formElement}
			method="post"
			use:enhance
			action="/login"
			class="w-full"
			use:focusTrap={isFocused}
		>
			<div class="space-y-4 md:space-y-6 mb-4">
				<div>
					<Field {form} name="email">
						<Control let:attrs>
							<div class="space-y-1">
								<Label asChild={true}>
									<label class="label" for="email">
										<span>Email</span>
									</label>
								</Label>
								<input
									{...attrs}
									bind:value={$formData.email}
									type="email"
									id="email"
									placeholder="name@example.com"
									class="input"
								/>
							</div>
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				<div>
					<Field {form} name="password">
						<Control let:attrs>
							<div class="space-y-1">
								<Label asChild={true}>
									<div class="flex items-center justify-between">
										<label for="password" class="label">
											<span>Password</span>
										</label>

										<a href="/reset-password" class="text-sm font-medium anchor">Forgot password?</a
										>
									</div>
								</Label>
								<input
									{...attrs}
									type="password"
									bind:value={$formData.password}
									id="password"
									class="input"
									placeholder="•••••••••••••"
								/>
							</div>
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				{#if totpCodeRequired}
					<div>
						<Field {form} name="totp_code">
							<Control let:attrs>
								<div class="space-y-1">
									<Label asChild={true}>
										<label class="label" for="totp_code">
											<span>TOTP Code</span>
										</label>
									</Label>
									<input
										{...attrs}
										bind:value={$formData.totp_code}
										type="text"
										id="totp_code"
										placeholder="123456"
										class="input"
									/>
								</div>
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</div>
				{/if}
			</div>
		</form>

		<button class="w-full btn preset-filled" onclick={handleSubmit}>
			{#if $delayed}
				<Loader2 class="size-6 animate-spin" />
			{:else if totpCodeRequired}
				Submit
			{:else}
				Login
			{/if}
		</button>
		<div class="text-sm w-full text-center pt-2">
			Don't have an account yet? <a href="/register" class="font-medium anchor">Sign up</a>
		</div>
	</section>
</div>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Enter') handleSubmit();
	}}
/>
