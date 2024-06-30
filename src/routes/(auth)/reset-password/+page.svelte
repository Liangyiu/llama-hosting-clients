<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { resetPasswordSchema } from '$lib/form-schemas';
	import { CircleAlertIcon, Loader2 } from 'lucide-svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(resetPasswordSchema)
	});

	const { enhance, form: formData, delayed, message } = form;

	let isFocused: boolean = true;
</script>

<div class="card">
	<div class="card-header">
		<h1 class="h3">Reset password</h1>
		<p class="text-sm">Further instructions will be sent to you</p>
	</div>
	<section class="flex flex-col items-center justify-center p-4 w-full">
		{#if $message}
			<aside class="alert variant-soft-error w-full mb-4">
				<!-- Icon -->
				<div>
					<CircleAlertIcon class="size-4" />
				</div>
				<!-- Message -->
				<div class="alert-message">
					<p>{$message.message}</p>
				</div>
				<!-- Actions -->
			</aside>
		{/if}
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
