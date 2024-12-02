<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/form-schemas';
	import { CircleAlertIcon, Loader2 } from 'lucide-svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { getContext } from 'svelte';
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte';

	let { data } = $props();

	const toast: ToastContext = getContext('toast');

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});

	const { enhance, form: formData, delayed, message } = form;

	let isFocused: boolean = true;

	message.subscribe((m) => {
		if (m) {
			if (m.message === 'Email already in use or not yet verified') {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else if (m.message === 'An error occurred during the registration process') {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			}
		}
	});
</script>

<div class="card">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Register</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		<form method="post" use:enhance action="/register" class="w-full" use:focusTrap={isFocused}>
			<div class="space-y-4 md:space-y-6 mb-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Field {form} name="first_name">
							<Control let:attrs>
								<div class="space-y-1">
									<Label asChild={true}>
										<label class="label" for="first_name">
											<span>First name</span>
										</label>
									</Label>
									<input
										{...attrs}
										bind:value={$formData.first_name}
										id="first_name"
										placeholder="John"
										class="input"
									/>
								</div>
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</div>
					<div>
						<Field {form} name="last_name">
							<Control let:attrs>
								<div class="space-y-1">
									<Label asChild={true}>
										<label class="label" for="last_name">
											<span>Last name</span>
										</label>
									</Label>
									<input
										{...attrs}
										bind:value={$formData.last_name}
										id="last_name"
										placeholder="Doe"
										class="input"
									/>
								</div>
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</div>
				</div>
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
									<label for="password" class="label">
										<span>Password</span>
									</label>
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

				<div>
					<Field {form} name="passwordConfirm">
						<Control let:attrs>
							<div class="space-y-1">
								<Label asChild={true}>
									<label for="password_confirm" class="label">
										<span>Confirm Password</span>
									</label>
								</Label>
								<input
									{...attrs}
									type="password"
									bind:value={$formData.passwordConfirm}
									id="password_confirm"
									class="input"
									placeholder="•••••••••••••"
								/>
							</div>
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				<div>
					<Field {form} name="accept_terms">
						<Control let:attrs>
							<div class=" flex items-start space-x-2">
								<input
									{...attrs}
									type="checkbox"
									bind:checked={$formData.accept_terms}
									id="accept_terms"
									class="checkbox"
								/>
								<Label asChild={true}>
									<label for="accept_terms" class="label">
										<p>
											I accept the <a href="/terms-of-service" class="anchor">terms of service</a>
											&
											<a href="/privacy-policy" class="anchor">privacy policy</a>
										</p>
									</label>
								</Label>
							</div>
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>
			</div>

			<button type="submit" class="w-full btn preset-filled">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Register
				{/if}
			</button>
			<div class="text-sm w-full text-center pt-2">
				Already have an account? <a href="/login" class="font-medium anchor">Login</a>
			</div>
		</form>
	</section>
</div>
