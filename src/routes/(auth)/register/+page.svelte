<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registerSchema } from '$lib/form-schemas';
	import Loader2 from '~icons/lucide/loader2';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { toast as sonner } from 'svelte-sonner';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});

	const { enhance, form: formData, delayed, message } = form;

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

<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-4">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Register</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		<form method="post" use:enhance action="/register" class="w-full">
			<div class="space-y-4 md:space-y-6 mb-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Field {form} name="first_name">
							<Control>
								{#snippet children({ props })}
									<div class="space-y-1">
										<Label>
											{#snippet child({ props })}
												<label {...props} class="label" for="first_name">
													<span>First name</span>
												</label>
											{/snippet}
										</Label>
										<input
											{...props}
											bind:value={$formData.first_name}
											id="first_name"
											placeholder="John"
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
						<Field {form} name="last_name">
							<Control>
								{#snippet children({ props })}
									<div class="space-y-1">
										<Label>
											{#snippet child({ props })}
												<label {...props} class="label" for="last_name">
													<span>Last name</span>
												</label>
											{/snippet}
										</Label>
										<input
											{...props}
											bind:value={$formData.last_name}
											id="last_name"
											placeholder="Doe"
											class="input"
											tabindex="2"
										/>
									</div>
								{/snippet}
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
					</div>
				</div>
				<div>
					<Field {form} name="email">
						<Control>
							{#snippet children({ props })}
								<div class="space-y-1">
									<Label>
										{#snippet child({ props })}
											<label {...props} class="label" for="email">
												<span>Email</span>
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
										tabindex="3"
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
											<label {...props} for="password" class="label">
												<span>Password</span>
											</label>
										{/snippet}
									</Label>
									<input
										{...props}
										type="password"
										bind:value={$formData.password}
										id="password"
										class="input"
										placeholder="•••••••••••••"
										tabindex="4"
									/>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				<div>
					<Field {form} name="passwordConfirm">
						<Control>
							{#snippet children({ props })}
								<div class="space-y-1">
									<Label>
										{#snippet child({ props })}
											<label {...props} for="password_confirm" class="label">
												<span>Confirm Password</span>
											</label>
										{/snippet}
									</Label>
									<input
										{...props}
										type="password"
										bind:value={$formData.passwordConfirm}
										id="password_confirm"
										class="input"
										placeholder="•••••••••••••"
										tabindex="5"
									/>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>

				<div>
					<Field {form} name="accept_terms">
						<Control>
							{#snippet children({ props })}
								<div class=" flex items-start space-x-2">
									<input
										{...props}
										type="checkbox"
										bind:checked={$formData.accept_terms}
										id="accept_terms"
										class="checkbox"
										tabindex="6"
									/>
									<Label>
										{#snippet child({ props })}
											<label {...props} for="accept_terms" class="label">
												<p>
													I accept the <a
														href="/terms-of-service"
														class="anchor"
														tabindex="7"
														target="_blank">terms of service</a
													>
													&
													<a href="/privacy-policy" class="anchor" tabindex="8" target="_blank"
														>privacy policy</a
													>
												</p>
											</label>
										{/snippet}
									</Label>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>
			</div>

			<button type="submit" class="w-full btn preset-filled" tabindex="9">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Register
				{/if}
			</button>
			<div class="text-sm w-full text-center pt-2">
				Already have an account? <a href="/login" class="font-medium anchor" tabindex="10">Login</a>
			</div>
		</form>
	</section>
</div>
