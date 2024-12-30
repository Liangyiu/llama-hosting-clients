<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from '$lib/form-schemas';
	import Loader2 from '~icons/lucide/loader2';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { toast as sonner } from 'svelte-sonner';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema)
	});

	const { enhance, form: formData, delayed, message } = form;

	message.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				sonner.success(m.message);
			} else if (m.message === 'An error occurred during the password reset process') {
				sonner.error(m.message);
			}
		}
	});
</script>

<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 p-4">
	<div class="card-header">
		<div class="w-full justify-between align-middle flex">
			<h1 class="h3">Reset password</h1>

			<div class="items-center flex">
				<LightSwitch />
			</div>
		</div>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		<form method="post" use:enhance action="/reset-password" class="w-full">
			<div class="space-y-4 md:space-y-6 mb-4">
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
										tabindex="1"
									/>
								</div>
							{/snippet}
						</Control>
						<FieldErrors class="text-error-500" />
					</Field>
				</div>
			</div>

			<button type="submit" class="w-full btn preset-filled" tabindex="2">
				{#if $delayed}
					<Loader2 class="size-6 animate-spin" />
				{:else}
					Submit
				{/if}
			</button>
		</form>
	</section>
</div>
