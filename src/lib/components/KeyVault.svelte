<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Paginator,
		type PaginationSettings
	} from '@skeletonlabs/skeleton';
	import type { ListResult } from 'pocketbase';
	import KeyVaultItem from './KeyVaultItem.svelte';

	export let sshKeysPage: ListResult<{
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

	$: paginationSettings = {
		page: sshKeysPage.page - 1,
		limit: sshKeysPage.perPage,
		size: sshKeysPage.totalItems,
		amounts: [5, 10, 15, 20]
	} satisfies PaginationSettings;
</script>

{#if sshKeysPage.items.length === 0}
	<div>No SSH Keys</div>
{:else}
	<div class="space-y-4">
		{#each sshKeysPage.items as keyData}
			<Accordion class="rounded-[var(--theme-rounded-container)] variant-ghost-surface">
				<AccordionItem>
					<svelte:fragment slot="summary">
						<span class="text-lg">
							{keyData.key_name || 'undefined'}
						</span>
						{#if keyData.is_default}
							<span class="ml-2 badge variant-filled-surface">default</span>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="content">
						<KeyVaultItem
							{keyData}
							on:defaultKeyAdded={() => {
								keyData.is_default = true;
							}}
							on:defaultKeyRemoved={() => {
								keyData.is_default = false;
							}}
						/>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		{/each}

		<Paginator
			bind:settings={paginationSettings}
			showFirstLastButtons={false}
			showPreviousNextButtons={true}
			on:amount
			on:page
		/>
	</div>
{/if}
