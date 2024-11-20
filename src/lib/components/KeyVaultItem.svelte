<script lang="ts">
	let { keyData = $bindable(), addDefaultKey, removeDefaultKey, deleteKey } = $props();
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
				<button class="btn btn-sm variant-filled-error" onclick={() => deleteKey(keyData.id)}
					>Delete</button
				>
			</div>
		</div>
	</section>
</div>
