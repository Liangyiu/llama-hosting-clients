<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/form-schemas';
	import * as Form from '$lib/components/ui/form/index.js';
	import { toast as sonner } from 'svelte-sonner';
	import Loader2 from '~icons/lucide/loader2';

	interface Props {
		formSetup: SuperValidated<
			{
				first_name: string;
				last_name: string;
				email: string;
				password: string;
				passwordConfirm: string;
				accept_terms: boolean;
			},
			any,
			{
				first_name: string;
				last_name: string;
				email: string;
				password: string;
				passwordConfirm: string;
				accept_terms: boolean;
			}
		>;
	}

	let { formSetup }: Props = $props();

	const form = superForm(formSetup, {
		validators: zodClient(registerSchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	message.subscribe((m) => {
		if (m) {
			if (m.message === 'Email already in use or not yet verified') {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form action="/register" method="post" use:enhance>
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="first_name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label for="first_name">First name</Form.Label>
								<Input
									{...props}
									id="first_name"
									placeholder="Max"
									type="text"
									required
									bind:value={$formData.first_name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="last_name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label for="last_name">Last name</Form.Label>
								<Input
									{...props}
									id="last_name"
									placeholder="Robinson"
									type="text"
									required
									bind:value={$formData.last_name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="email">Email</Form.Label>
							<Input
								{...props}
								id="email"
								placeholder="me@example.com"
								type="email"
								required
								bind:value={$formData.email}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="password">Password</Form.Label>
							<Input
								{...props}
								id="password"
								placeholder="•••••••••••••"
								type="password"
								required
								bind:value={$formData.password}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="passwordConfirm">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="passwordConfirm">Confirm password</Form.Label>
							<Input
								{...props}
								id="passwordConfirm"
								placeholder="•••••••••••••"
								type="password"
								required
								bind:value={$formData.passwordConfirm}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="accept_terms">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center space-x-2">
								<Checkbox {...props} id="accept_terms" bind:checked={$formData.accept_terms} />
								<Label for="accept_terms"
									>I accept the <a href="/terms-of-service" class="underline" target="_blank"
										>Terms of Service</a
									>
									and
									<a href="/privacy-policy" class="underline" target="_blank">Privacy Policy</a
									></Label
								>
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Button type="submit" class="w-full"
					>{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						Create an account
					{/if}</Button
				>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
