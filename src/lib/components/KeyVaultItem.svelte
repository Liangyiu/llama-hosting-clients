<script lang="ts">
	let { keyData = $bindable(), addDefaultKey, removeDefaultKey, deleteKey } = $props();
</script>

<div class="p-4 card preset-ghost-surface">
	<header>
		<h6 class="h6">Public Key</h6>
	</header>
	<section class="p-2 space-y-2">
		<div class="max-w-full">
			<div>
				<textarea
					class="textarea preset-outlined-surface-400-600"
					readonly
					rows="2"
					bind:value={keyData.public_key}
				></textarea>
			</div>
		</div>
		<div>
			<hr class="!border-t-2 mt-4" />
		</div>
		<div class="flex justify-end space-x-2">
			<div>
				{#if keyData.is_default}
					<button class="btn preset-filled-surface-500" onclick={() => removeDefaultKey(keyData.id)}
						>Remove Default</button
					>
				{:else}
					<button class="btn preset-filled-surface-500" onclick={() => addDefaultKey(keyData.id)}
						>Make Default</button
					>
				{/if}
			</div>
			<div>
				<button class="btn preset-outlined-error-500" onclick={() => deleteKey(keyData.id)}
					>Delete</button
				>
			</div>
		</div>
	</section>
</div>
