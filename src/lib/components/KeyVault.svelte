<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		getToastStore,
		Paginator,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import type { ListResult } from 'pocketbase';
	import KeyVaultItem from './KeyVaultItem.svelte';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	interface Props {
		sshKeysPage: ListResult<{
			collectionName: 'ssh_keys';
			user: string;
			public_key: string;
			key_name: string;
			is_default: boolean;
			id: string;
			created: string;
			updated: string;
			collectionId: string;
		}>;
		page: number;
		pageSize: number;
	}

	let { sshKeysPage, page, pageSize }: Props = $props();

	let sshKeys = $state(sshKeysPage.items);

	let paginationSettings = {
		page: page - 1,
		limit: pageSize,
		size: sshKeysPage.totalItems,
		amounts: [5, 10, 15, 20]
	};

	async function addDefaultKey(id: string, index: number) {
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
			let updatedSshKey = sshKeys[index];
			updatedSshKey.is_default = true;
			sshKeys[index] = updatedSshKey;
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

	async function removeDefaultKey(id: string, index: number) {
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
			sshKeys[index].is_default = false;
		} else {
			const toastConfig: ToastSettings = {
				message: 'Error: Failed to remove default SSH key. Try again later',
				background: 'variant-soft-error',
				timeout: 8000
			};

			toastStore.trigger(toastConfig);
		}
	}

	async function deleteKey(id: string) {
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

{#if sshKeysPage.items.length === 0}
	<div>No SSH Keys</div>
{:else}
	<div class="space-y-4">
		{#each sshKeys as keyData, index}
			<Accordion class="rounded-[var(--theme-rounded-container)] variant-ghost-surface">
				<AccordionItem>
					{#snippet summary()}
						<span class="text-lg">
							{keyData.key_name || 'undefined'}
						</span>
						{#if keyData.is_default}
							<span class="ml-2 badge variant-filled-surface">default</span>
						{/if}
					{/snippet}
					{#snippet content()}
						<KeyVaultItem
							bind:keyData={sshKeys[index]}
							addDefaultKey={async (id: string) => {
								await addDefaultKey(id, index);
							}}
							removeDefaultKey={async (id: string) => {
								await removeDefaultKey(id, index);
							}}
							deleteKey={async (id: string) => {
								await deleteKey(id);
							}}
						/>
					{/snippet}
				</AccordionItem>
			</Accordion>
		{/each}

		<Paginator
			settings={paginationSettings}
			showFirstLastButtons={false}
			showPreviousNextButtons={true}
			on:amount={(e) => {
				if (e.detail !== pageSize) {
					goto(`?page=${1}&pageSize=${e.detail}`);
				}
			}}
			on:page={(e) => {
				if (e.detail !== page - 1) {
					goto(`?page=${e.detail + 1}&pageSize=${pageSize}`);
				}
			}}
		/>
	</div>
{/if}
