<script lang="ts">
	import { addSshKeySchema } from '$lib/form-schemas.js';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import KeyVault from '$lib/components/KeyVault.svelte';

	import { toast as sonner } from 'svelte-sonner';

	let { data } = $props();

	const addSshKeyForm = superForm(data.sshKeyForm, {
		validators: zodClient(addSshKeySchema)
	});

	const { form: addSshKeyFormData, enhance, delayed, message } = addSshKeyForm;

	message.subscribe((m) => {
		if (m) {
			if (m.message === 'SSH key added successfully' && m.status === 200) {
				sonner.success(m.message);
			} else if (m.message === 'SSH key already exists' && m.status === 400) {
				sonner.error(m.message);
			} else if (m.message === 'Error: Failed to add SSH key' && m.status === 400) {
				sonner.error(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
			}
		}
	});
</script>

<div class="w-full">
	<div>
		<h4 class="h4 hidden md:block">SSH Key Vault</h4>
	</div>

	<div class="md:py-6 py-4 space-y-8 md:space-y-14">
		<section class="space-y-4">
			<h5 class="h5">Add SSH Key</h5>
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form action="/settings/ssh-key-vault/?/addSshKey" method="post" use:enhance>
					<div class="space-y-4 md:space-y-6">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={addSshKeyForm} name="public_key">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="public_key">
													<span class="label-text">Public Key</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$addSshKeyFormData.public_key}
												id="public_key"
												placeholder="e.g. ssh-ed25519 ..."
												class="input preset-outlined"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={addSshKeyForm} name="key_name">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="key_name">
													<span class="label-text">Key Description</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$addSshKeyFormData.key_name}
												id="last_name"
												placeholder="optional e.g. user (at) machine"
												class="input preset-outlined"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
					</div>
					<button type="submit" class="btn preset-filled-primary-300-700 mt-4">
						{#if $delayed}
							<Loader2 class="size-6 animate-spin" />
						{:else}
							Add key
						{/if}
					</button>
				</form>
			</div>
		</section>
		<section class="space-y-4">
			<h5 class="h5">Key Vault</h5>
			<div class="p-2 flex flex-col w-full">
				{#await data.sshKeysPromise}
					<div class="w-full justify-center">
						<Loader2 class="animate-spin size-12" />
					</div>
				{:then sshKeys}
					<KeyVault {sshKeys} page={data.page} pageSize={data.pageSize} />
				{:catch error}
					<p>an error occurred</p>
				{/await}
			</div>
		</section>
	</div>
</div>
