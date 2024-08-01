<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from '$lib/form-schemas';
	import { CircleAlertIcon, Loader2 } from 'lucide-svelte';
	import { focusTrap, LightSwitch, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	const toastStore = getToastStore();

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema)
	});

	const { enhance, form: formData, delayed, message } = form;

	let isFocused: boolean = true;

	message.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-success',
					autohide: false,
					action: {
						label: 'Login',
						response: () => {
							goto('/login');
							toastStore.clear();
						}
					}
				};

				toastStore.trigger(toastConfig);
			} else if (m.message === 'An error occurred during the password reset process') {
				const toastConfig: ToastSettings = {
					message: m.message,
					background: 'variant-soft-error',
					timeout: 8000
				};

				toastStore.trigger(toastConfig);
			}
		}
	});
</script>

<div class="card">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Reset password</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		<form
			method="post"
			use:enhance
			action="/reset-password"
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
			</div>

			<button type="submit" class="w-full btn variant-filled">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Submit
				{/if}
			</button>
		</form>
	</section>
</div>
