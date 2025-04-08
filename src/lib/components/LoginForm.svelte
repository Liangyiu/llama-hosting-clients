<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { loginSchema } from '$lib/form-schemas';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast as sonner } from 'svelte-sonner';
	import Loader2 from '~icons/lucide/loader2';
	import autoAnimate from '@formkit/auto-animate';
	import { Button } from '$lib/components/ui/button/index.js';
	import { KeyRound } from 'lucide-svelte';
	import { authClient } from '$lib/client/auth-client';
	import Link from './ui/shadcn-svelte-extras/link/link.svelte';

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

	const form = superForm(formSetup, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	let email = $state('');

	message.subscribe((m) => {
		if (m) {
			if (m.status === 403 && m.message === 'Please verify your email') {
				sonner.info('Please verify your email');
			} else if (m.status === 400 && m.message === 'Invalid credentials') {
				sonner.error(m.message);
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
		const { error } = await authClient.signIn.magicLink({ email, callbackURL: '/dashboard' });

		if (error) {
			if (error.code === authClient.$ERROR_CODES.EMAIL_NOT_VERIFIED) {
				sonner.info('Please verify your email');
			}
		}
	}
</script>

<Card.Root class="mx-auto max-w-md">
	<Card.Header>
		<Card.Title class="text-2xl">Welcome</Card.Title>
		<Card.Description>Sign in to your account or create a new one</Card.Description>
	</Card.Header>
	<Card.Content>
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
								bind:value={email}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Button class="w-full" onclick={handleSubmit}>
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Continue with Email
				{/if}
			</Button>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<Button variant="secondary">
				<KeyRound />
				Continue with Passkey
			</Button>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col space-y-4 pt-0">
		<div class="text-center text-xs text-muted-foreground">
			By continuing, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#"
				>Privacy Policy</Link
			>.
		</div>
	</Card.Footer>
</Card.Root>
