<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { loginSchema } from '$lib/form-schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast as sonner } from 'svelte-sonner';
	import Loader2 from '~icons/lucide/loader2';
	import PwInput from './ui/origin-svelte/PwInput.svelte';
	import autoAnimate from '@formkit/auto-animate';

	interface Props {
		formSetup: SuperValidated<
			{
				email: string;
				password: string;
				totp_code?: string | undefined;
			},
			any,
			{
				email: string;
				password: string;
				totp_code?: string | undefined;
			}
		>;
	}

	let { formSetup }: Props = $props();

	let formElement: HTMLFormElement = $state()!;

	const form = superForm(formSetup, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	let totpCodeRequired = $state(false);
	let capturedFormData = $state({
		email: '',
		password: ''
	});

	message.subscribe((m) => {
		if (m) {
			if (m.status === 403 && m.message === 'Please verify your email') {
				sonner.info('Please verify your email');
			} else if (m.status === 400 && m.message === 'Invalid credentials') {
				sonner.error(m.message);
			} else if (m.status === 400 && m.message === 'Please enter your TOTP code') {
				sonner.info(m.message);

				totpCodeRequired = true;

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

	async function handleSubmit() {
		capturedFormData.email = $formData.email;
		capturedFormData.password = $formData.password;

		formElement.requestSubmit();
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Client-Login</Card.Title>
		<Card.Description>Enter your credentials below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form bind:this={formElement} method="post" use:enhance action="/login">
			<div class="grid gap-4" use:autoAnimate>
				<div class="grid gap-2">
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Email</Form.Label>
								<Input
									{...props}
									id="email"
									type="email"
									placeholder="me@example.com"
									required
									autocomplete="email"
									bind:value={$formData.email}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid gap-2">
					<Form.Field {form} name="password">
						<Form.Control>
							{#snippet children({ props })}
								<PwInput
									{...props}
									bind:value={$formData.password}
									extraLabel
									extraLabelHref="/reset-password"
									extraLabelText="Forgot your password?"
									autocomplete="current-password"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				{#if totpCodeRequired}
					<div class="grid gap-2">
						<Form.Field {form} name="totp_code">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>TOTP Code</Form.Label>
									<Input
										{...props}
										id="totp_code"
										type="text"
										placeholder="••••••"
										required
										bind:value={$formData.totp_code}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{/if}
				<Form.Button class="w-full" onclick={handleSubmit}>
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						Login
					{/if}
				</Form.Button>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/register" class="underline"> Sign up </a>
		</div>
	</Card.Content>
</Card.Root>
