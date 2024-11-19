<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import {
		getModalStore,
		getToastStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	interface Props {
		keyData: {
		collectionName: string;
		user: string;
		public_key: string;
		key_name: string;
		is_default: boolean;
		id: string;
		created: string;
		updated: string;
		collectionId: string;
	};
	}

	let { keyData = $bindable() }: Props = $props();

	const dispatch = createEventDispatcher();

	async function addDefaultKey(id: string) {
		const confirmed = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Please Confirm',
				body: 'Are you sure you wish to proceed? Having a default key will deactivate password login for the root user on new KVM servers.',
				response: (r: boolean) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

		if (!(await confirmed)) return;

		const response = await fetch(`/api/account/key-vault/add-default/${id}`, {
			method: 'PUT'
		});

		if (response.ok) {
			keyData.is_default = true;

			dispatch('defaultKeyAdded', {
				id
			});
		} else {
			const toastConfig: ToastSettings = {
				message: '',
				background: 'variant-soft-error',
				timeout: 8000
			};

			if (response.status === 403) {
				toastConfig.message = 'Limit-Error: Maximum number of default SSH keys reached (5)';
			} else {
				toastConfig.message = 'Error: Failed to add default SSH key. Try again later';
			}

			toastStore.trigger(toastConfig);
		}
	}

	async function removeDefaultKey(id: string) {
		const confirmed = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Please Confirm',
				body: 'Are you sure you wish to proceed?',
				response: (r: boolean) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

		if (!(await confirmed)) return;

		const response = await fetch(`/api/account/key-vault/remove-default/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			keyData.is_default = false;
			dispatch('defaultKeyRemoved', {
				id
			});
			// show toast
		} else {
			const toastConfig: ToastSettings = {
				message: 'Error: Failed to remove default SSH key. Try again later',
				background: 'variant-soft-error',
				timeout: 8000
			};

			toastStore.trigger(toastConfig);
		}
	}

	async function removeKey(id: string) {
		const confirmed = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Please Confirm',
				body: 'Are you sure you wish to proceed? You will have to manually remove the SSH keys from your servers.',
				response: (r: boolean) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});

		if (!(await confirmed)) return;

		const response = await fetch(`/api/account/key-vault/remove-key/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.reload();
		} else {
			const toastConfig: ToastSettings = {
				message: 'Error: Failed to remove SSH key. Try again later',
				background: 'variant-soft-error',
				timeout: 8000
			};

			toastStore.trigger(toastConfig);
		}
	}
</script>

<div class="p-4 card variant-ghost-surface">
	<header>
		<h6 class="h6">Public Key</h6>
	</header>
	<section class="p-2 space-y-2">
		<div class="max-w-full overflow-x-scroll">
			<div>
				<textarea class="textarea" readonly rows="2" bind:value={keyData.public_key}></textarea>
			</div>
		</div>
		<div>
			<hr class="!border-t-2 mt-4" />
		</div>
		<div class="flex justify-end space-x-2">
			<div>
				{#if keyData.is_default}
					<button
						class="btn btn-sm variant-filled-warning"
						onclick={() => removeDefaultKey(keyData.id)}>Remove Default</button
					>
				{:else}
					<button
						class="btn btn-sm variant-filled-surface"
						onclick={() => addDefaultKey(keyData.id)}>Make Default</button
					>
				{/if}
			</div>
			<div>
				<button class="btn btn-sm variant-filled-error" onclick={() => removeKey(keyData.id)}
					>Delete</button
				>
			</div>
		</div>
	</section>
</div>
