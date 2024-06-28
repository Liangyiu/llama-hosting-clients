<script lang="ts">
	import { focusTrap } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/form-schemas';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { CircleAlertIcon, Loader2, MailWarning } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data: PageData;
	let newUser = $page.url.searchParams.get('new_user');
	let loggedOut = $page.url.searchParams.get('logout');

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});
	const { form: formData, enhance, message, delayed } = form;

	let isFocused: boolean = true;
</script>

<div class="card">
	<div class="card-header">
		<h1 class="h3">Client-Login</h1>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		{#if newUser}
			<aside class="alert variant-ghost w-full mb-4">
				<!-- Icon -->
				<div>
					<MailWarning class="size-4" />
				</div>
				<!-- Message -->
				<div class="alert-message">
					<p>Make sure to verify your email</p>
				</div>
			</aside>
		{/if}
		{#if loggedOut}
			<aside class="alert variant-soft-success w-full mb-4">
				<!-- Icon -->
				<div>
					<CircleAlertIcon class="size-4" />
				</div>
				<!-- Message -->
				<div class="alert-message">
					<p>You have been logged out</p>
				</div>
				<!-- Actions -->
			</aside>
		{/if}
		<form
			method="post"
			use:enhance
			action="/clients/login"
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
										<span>Password</span>
										<a href="/clients/reset-password" class="text-sm font-medium anchor"
											>Forgot password?</a
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
			</div>

			<button type="submit" class="w-full btn variant-filled">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Login
				{/if}
			</button>
			<div class="text-sm w-full text-center pt-2">
				Don't have an account yet? <a href="/clients/register" class="font-medium anchor">Sign up</a
				>
			</div>
		</form>
	</section>
</div>
