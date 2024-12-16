<script lang="ts">
	import IconArrowLeft from 'lucide-svelte/icons/arrow-left';
	import IconArrowRight from 'lucide-svelte/icons/arrow-right';
	import IconEllipsis from 'lucide-svelte/icons/ellipsis';
	import IconFirst from 'lucide-svelte/icons/chevrons-left';
	import IconLast from 'lucide-svelte/icons/chevron-right';

	import { Accordion, Modal, Pagination } from '@skeletonlabs/skeleton-svelte';
	import type { ListResult } from 'pocketbase';
	import KeyVaultItem from './KeyVaultItem.svelte';

	import { toast as sonner } from 'svelte-sonner';

	let modalSettings = {
		title: '',
		description: ''
	};

	let modalOpenState = $state(false);

	let modalContext = $state<{
		action: 'addDefaultKey' | 'removeDefaultKey' | 'deleteKey' | undefined;
		keyData: {
			id: string;
			index: number;
		};
	}>({
		action: undefined,
		keyData: {
			id: '',
			index: 0
		}
	});

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

	// let paginationSettings = {
	// 	page: page - 1,
	// 	limit: pageSize,
	// 	size: sshKeysPage.totalItems,
	// 	amounts: [5, 10, 15, 20]
	// };

	function showConfirmModal() {
		modalOpenState = true;
	}

	async function handleModalConfirm() {
		modalOpenState = false;

		switch (modalContext.action) {
			case 'addDefaultKey':
				await addDefaultKey(modalContext.keyData.id, modalContext.keyData.index);

				break;
			case 'removeDefaultKey':
				await removeDefaultKey(modalContext.keyData.id, modalContext.keyData.index);

				break;
			case 'deleteKey':
				await deleteKey(modalContext.keyData.id);
				break;
			default:
				break;
		}
	}

	function handleModalCancellation() {
		modalOpenState = false;
		modalContext.action = undefined;
	}

	async function addDefaultKey(id: string, index: number) {
		const response = await fetch(`/api/account/key-vault/add-default/${id}`, {
			method: 'PUT'
		});

		if (response.ok) {
			let updatedSshKey = sshKeys[index];
			updatedSshKey.is_default = true;
			sshKeys[index] = updatedSshKey;
		} else {
			let message = '';

			if (response.status === 403) {
				message = 'Limit-Error: Maximum number of default SSH keys reached (5)';
			} else {
				message = 'Error: Failed to add default SSH key. Try again later';
			}

			sonner.error(message);
		}
	}

	async function removeDefaultKey(id: string, index: number) {
		const response = await fetch(`/api/account/key-vault/remove-default/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			sshKeys[index].is_default = false;
		} else {
			sonner.error('Error: Failed to remove default SSH key. Try again later');
		}
	}

	async function deleteKey(id: string) {
		const response = await fetch(`/api/account/key-vault/remove-key/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.reload();
		} else {
			sonner.error('Error: Failed to remove SSH key. Try again later');
		}
	}
</script>

{#if sshKeysPage.items.length === 0}
	<div>No SSH Keys</div>
{:else}
	<Modal
		bind:open={modalOpenState}
		triggerBase="btn preset-tonal"
		contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm md:min-w-96"
		backdropClasses="backdrop-blur-sm"
	>
		{#snippet content()}
			<header class="flex justify-between">
				<h3 class="h3">{modalSettings.title}</h3>
			</header>
			<article>
				<p class="opacity-60">
					{modalSettings.description}
				</p>
			</article>
			<footer class="flex justify-end gap-4">
				<button type="button" class="btn preset-tonal" onclick={handleModalCancellation}
					>Cancel</button
				>
				<button type="button" class="btn preset-filled" onclick={handleModalConfirm}>Confirm</button
				>
			</footer>
		{/snippet}
	</Modal>

	<div class="space-y-4">
		{#each sshKeys as keyData, index}
			<Accordion
				collapsible
				rounded="rounded-[var(--theme-rounded-container)]"
				base="preset-filled-surface-300-700 rounded-container"
			>
				<Accordion.Item value={keyData.id}>
					{#snippet control()}
						<span class="text-lg">
							{keyData.key_name || 'undefined'}
						</span>
						{#if keyData.is_default}
							<span class="ml-2 badge preset-filled-surface-500">default</span>
						{/if}
					{/snippet}
					{#snippet panel()}
						<KeyVaultItem
							bind:keyData={sshKeys[index]}
							addDefaultKey={async (id: string) => {
								modalContext.action = 'addDefaultKey';
								modalContext.keyData = { id, index };
								modalSettings.title = 'Please Confirm';
								modalSettings.description =
									'Are you sure you wish to proceed? Having a default key will deactivate password login for the root user on new KVM servers.';

								showConfirmModal();
							}}
							removeDefaultKey={async (id: string) => {
								modalContext.action = 'removeDefaultKey';
								modalContext.keyData = { id, index };
								modalSettings.title = 'Please Confirm';
								modalSettings.description = 'Are you sure you wish to proceed?';

								showConfirmModal();
							}}
							deleteKey={async (id: string) => {
								modalContext.action = 'deleteKey';
								modalContext.keyData = { id, index };
								modalSettings.title = 'Please Confirm';
								modalSettings.description =
									'Are you sure you wish to proceed? You will have to manually remove the SSH keys from your servers.';

								showConfirmModal();
							}}
						/>
					{/snippet}
				</Accordion.Item>
			</Accordion>
		{/each}

		<Pagination
			data={[]}
			bind:page
			bind:pageSize
			onPageChange={(details) => {
				console.log(details);
			}}
			onPageSizeChange={(details) => {
				console.log(details);
			}}
		>
			{#snippet labelEllipsis()}<IconEllipsis class="size-4" />{/snippet}
			{#snippet labelNext()}<IconArrowRight class="size-4" />{/snippet}
			{#snippet labelPrevious()}<IconArrowLeft class="size-4" />{/snippet}
			{#snippet labelFirst()}<IconFirst class="size-4" />{/snippet}
			{#snippet labelLast()}<IconLast class="size-4" />{/snippet}
		</Pagination>

		<!-- <Paginator
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
		/> -->
	</div>
{/if}
