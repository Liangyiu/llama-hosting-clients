<script lang="ts">
	import { avatarSchema } from '$lib/form-schemas.js';
	import { getUserState } from '$lib/stores/userStore.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { IconBug, IconCheck } from '@tabler/icons-svelte';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const avatarForm = superForm(data.avatarForm, {
		validators: zodClient(avatarSchema)
	});

	const {
		form: avatarFormData,
		enhance: avatarFormEnhance,
		message: avatarFormMessage,
		delayed: avatarFormDelayed
	} = avatarForm;

	const avatarFile = fileProxy(avatarFormData, 'avatar');

	let avatar: string | undefined = undefined;

	function onFileSelected(event: Event) {
		const image = $avatarFile[0];
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			// @ts-ignore
			avatar = e.target?.result;
		};
	}

	const user = getUserState();

	$: initials =
		($user.firstName.charAt(0).toUpperCase() || 'L') +
		($user.lastName.charAt(0).toUpperCase() || 'L');

	$: avatarUrl =
		$user.avatarUrl === ''
			? `https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&backgroundColor=b347fd,6553a8&backgroundRotation=240,360&textColor=ededed&seed=` +
				initials
			: `${$user.avatarUrl}?thumb=800x800`;

	$: customAvatarSet = $user.avatarUrl !== '';
</script>

<div class="w-full">
	<div>
		<h5 class="h4 hidden md:block">Account</h5>
	</div>

	<div class="md:py-6 py-4">
		<section class="space-y-4">
			<h5 class="h5">Avatar</h5>
			{#if $avatarFormMessage}
				{#if $avatarFormMessage === 'Avatar uploaded successfully'}
					<aside class="alert variant-soft-success w-full mb-4">
						<div>
							<IconCheck class="size-4" />
						</div>
						<div class="alert-message">
							<p>Success! <br class="md:hidden" />To see changes, refresh the page</p>
						</div>
					</aside>
				{:else}
					<aside class="alert variant-soft-error w-full mb-4">
						<div>
							<IconBug class="size-4" />
						</div>
						<div class="alert-message">
							<p>An error occurred while uploading your avatar</p>
						</div>
					</aside>
				{/if}
			{/if}
			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<Avatar src={avatar ? avatar : avatarUrl} width="w-28 md:w-32" rounded="rounded-full" />
				<div class="md:ml-6 space-y-4 w-36 mt-4 md:mt-0">
					<form
						action="/settings/account/?/uploadAvatar"
						method="post"
						enctype="multipart/form-data"
						use:avatarFormEnhance
					>
						<Field form={avatarForm} name="avatar">
							<Control let:attrs>
								<input
									{...attrs}
									type="file"
									name="avatar"
									id="avatarInput"
									accept="image/png, image/jpeg"
									bind:files={$avatarFile}
									class="max-w-60 sm:max-w-96"
									on:change={(e) => onFileSelected(e)}
								/>
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
						{#if $avatarFile.length > 0}
							<button type="submit" class="btn variant-soft-primary w-full mt-4">
								{#if $avatarFormDelayed}
									<Loader2 class="size-6 animate-spin" />
								{:else}
									Upload avatar
								{/if}
							</button>
						{/if}
					</form>

					{#if $avatarFile.length === 0}
						<form action="/settings/account/?/removeAvatar" method="post">
							<button
								type="submit"
								class="btn variant-soft-error w-full"
								disabled={!customAvatarSet}>Remove avatar</button
							>
						</form>
					{/if}
				</div>
			</div>
		</section>
	</div>
</div>
