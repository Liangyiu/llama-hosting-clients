<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { loginSchema } from '$lib/form-schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast as sonner } from 'svelte-sonner';
	import { Field } from 'formsnap';

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
			<div class="grid gap-4">
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
								<div class="flex items-center">
									<Form.Label>Password</Form.Label>
									<a href="/reset-password" class="ml-auto inline-block text-sm underline">
										Forgot your password?
									</a>
								</div>
								<Input
									{...props}
									id="password"
									type="password"
									placeholder="********"
									required
									bind:value={$formData.password}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				{#if totpCodeRequired}
					<div class="grid gap-2">
						<Form.Field {form} name="totp_code"></Form.Field>
					</div>
				{/if}

				<Button type="submit" class="w-full" onclick={handleSubmit}>Login</Button>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/register" class="underline"> Sign up </a>
		</div>
	</Card.Content>
</Card.Root>
