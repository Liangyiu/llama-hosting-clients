<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast as sonner } from 'svelte-sonner';
	import Loader2 from '~icons/lucide/loader2';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { resetPasswordSchema } from '$lib/form-schemas';

	interface Props {
		formSetup: SuperValidated<
			{
				email: string;
			},
			any,
			{
				email: string;
			}
		>;
	}

	let { formSetup }: Props = $props();

	const form = superForm(formSetup, {
		validators: zodClient(resetPasswordSchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	message.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				sonner.success(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Password reset</Card.Title>
		<Card.Description>Enter your email below to reset your password</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance action="/reset-password">
			<div class="grid gap-4">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="pw_reset_email">Email</Form.Label>
							<Input
								{...props}
								id="pw_reset_email"
								type="email"
								placeholder="me@example.com"
								required
								bind:value={$formData.email}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit" class="w-full">
					{#if $delayed}
						<Loader2 class="size-6 animate-spin" />
					{:else}
						Reset password
					{/if}
				</Form.Button>
			</div>
		</form>

		<div class="mt-4 text-center text-sm">
			Remembered your password?
			<a href="/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
