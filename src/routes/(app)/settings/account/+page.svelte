<script lang="ts">
	import { accountDetailsSchema, avatarSchema, changeEmailSchema } from '$lib/form-schemas';
	import { getUserState } from '$lib/stores/UserStore.svelte.js';
	import { supportedCountriesList } from '$lib/utils';
	import { IconBug, IconCheck } from '@tabler/icons-svelte';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import { Loader2 } from 'lucide-svelte';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';
	import { getContext } from 'svelte';
	import { type ToastContext } from '@skeletonlabs/skeleton-svelte';

	const toast: ToastContext = getContext('toast');

	let { data } = $props();

	const changeEmailForm = superForm(data.emailChangeForm, {
		validators: zodClient(changeEmailSchema)
	});

	const {
		form: changeEmailFormData,
		enhance: changeEmailFormEnhance,
		message: changeEmailFormMessage,
		delayed: changeEmailFormDelayed
	} = changeEmailForm;

	changeEmailFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				toast.create({
					title: 'Success',
					description: m.message,
					type: 'success',
					duration: 5000
				});
			} else if (m.status === 429) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			}
		}
	});

	const supportedCountries = ['', ...supportedCountriesList];

	const accountDetailsForm = superForm(data.accountDetailsForm, {
		validators: zodClient(accountDetailsSchema)
	});

	const {
		form: accountDetailsFormData,
		enhance: accountDetailsFormEnhance,
		message: accountDetailsFormMessage,
		delayed: accountDetailsFormDelayed
	} = accountDetailsForm;

	accountDetailsFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				toast.create({
					title: 'Success',
					description: m.message,
					type: 'success',
					duration: 5000
				});
			} else if (m.status === 429) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 15000
				});
			}
		}
	});

	const avatarForm = superForm(data.avatarForm, {
		validators: zodClient(avatarSchema)
	});

	const {
		form: avatarFormData,
		enhance: avatarFormEnhance,
		message: avatarFormMessage,
		delayed: avatarFormDelayed
	} = avatarForm;

	avatarFormMessage.subscribe((m) => {
		if (m) {
			if (m.status === 200) {
				toast.create({
					title: 'Success',
					description: m.message,
					type: 'success',
					duration: 5000
				});
			} else if (m.status === 429) {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 8000
				});
			} else {
				toast.create({
					title: 'Error',
					description: m.message,
					type: 'error',
					duration: 15000
				});
			}
		}
	});

	const avatarFile = fileProxy(avatarFormData, 'avatar');

	let avatar: string | undefined = $state(undefined);

	function onFileSelected() {
		const image = $avatarFile[0];
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			// @ts-ignore
			avatar = e.target?.result;
		};
	}

	const user = getUserState();

	let fullName = $derived(user.firstName + ' ' + user.lastName);

	let initials = $derived(
		(user.firstName.charAt(0).toUpperCase() || 'L') + (user.lastName.charAt(0).toUpperCase() || 'L')
	);

	let avatarUrl = $derived(
		user.avatarUrl === ''
			? `https://api.dicebear.com/9.x/initials/svg?backgroundType=gradientLinear&backgroundColor=b347fd,6553a8&backgroundRotation=240,360&textColor=ededed&seed=` +
					initials
			: `${user.avatarUrl}?thumb=800x800`
	);

	let customAvatarSet = $derived(user.avatarUrl !== '');

	accountDetailsFormData.set({
		first_name: user.firstName,
		last_name: user.lastName,
		address_line_one: user.addressLineOne,
		address_line_two: user.addressLineTwo,
		address_city: user.addressCity,
		address_state_province: user.addressStateProvince,
		address_country: user.addressCountry,
		address_postal_code: user.addressPostalCode,
		phone_number: user.phoneNumber,
		vat_id: user.vatId
	});
</script>

<div class="w-full">
	<div>
		<h4 class="h4 hidden md:block">Account</h4>
	</div>

	<div class="md:py-6 py-4 space-y-8 md:space-y-14">
		<section class="space-y-4">
			<h5 class="h5">Avatar</h5>

			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<Avatar
					name={fullName}
					src={avatar ? avatar : avatarUrl}
					size="w-28 h-28 md:h-32 md:w-32"
					rounded="rounded-full"
				/>
				<div class="md:ml-6 space-y-4 mt-4 md:mt-0 max-w-60 sm:max-w-96">
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
									class="input w-full"
									onchange={() => onFileSelected()}
								/>
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
						{#if $avatarFile.length > 0}
							<button type="submit" class="btn preset-soft-primary w-full mt-4">
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
							<button type="submit" class="btn preset-soft-error w-full" disabled={!customAvatarSet}
								>Remove avatar</button
							>
						</form>
					{/if}
				</div>
			</div>
		</section>
		<section class="space-y-4">
			<h5 class="h5">Account Details</h5>

			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form
					action="/settings/account/?/updateAccountDetails"
					method="post"
					use:accountDetailsFormEnhance
				>
					<div class="space-y-4 md:space-y-6">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={accountDetailsForm} name="first_name">
									<Control>
										{#snippet children({ attrs })}
											<div class="space-y-1">
												<Label asChild={true}>
													<label class="label" for="first_name">
														<span>First name</span>
													</label>
												</Label>
												<input
													{...attrs}
													bind:value={$accountDetailsFormData.first_name}
													id="first_name"
													placeholder={user.firstName}
													class="input"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="last_name">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="last_name">
													<span>Last name</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.last_name}
												id="last_name"
												placeholder={user.lastName}
												class="input"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<div>
							<Field form={accountDetailsForm} name="address_line_one">
								<Control>
									{#snippet children({ attrs })}
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="address_line_one">
													<span>Address Line 1</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.address_line_one}
												id="address_line_one"
												placeholder={user.addressLineOne !== ''
													? user.addressLineOne
													: 'e.g. Example Street 5'}
												class="input"
											/>
										</div>
									{/snippet}
								</Control>
								<FieldErrors class="text-error-500" />
							</Field>
						</div>
						<div>
							<Field form={accountDetailsForm} name="address_line_two">
								<Control>
									{#snippet children({ attrs })}
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="address_line_two">
													<span>Address Line 2</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.address_line_two}
												id="address_line_two"
												placeholder={user.addressLineTwo !== ''
													? user.addressLineTwo
													: 'e.g. Apt. 123'}
												class="input"
											/>
										</div>
									{/snippet}
								</Control>
								<FieldErrors class="text-error-500" />
							</Field>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={accountDetailsForm} name="address_postal_code">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="address_postal_code">
													<span>Postal code</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.address_postal_code}
												id="address_postal_code"
												placeholder={user.addressPostalCode !== ''
													? user.addressPostalCode
													: 'e.g. 52066'}
												class="input"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="address_city">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="address_city">
													<span>City</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.address_city}
												id="address_city"
												placeholder={user.addressCity !== '' ? user.addressCity : 'e.g. Aachen'}
												class="input"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={accountDetailsForm} name="address_state_province">
									<Control>
										{#snippet children({ attrs })}
											<div class="space-y-1">
												<Label asChild={true}>
													<label class="label" for="address_state_province">
														<span>Province/State</span>
													</label>
												</Label>
												<input
													{...attrs}
													bind:value={$accountDetailsFormData.address_state_province}
													id="address_state_province"
													placeholder={user.addressStateProvince !== ''
														? user.addressStateProvince
														: 'e.g. North Rhine-Westphalia'}
													class="input"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="address_country">
									<Control>
										{#snippet children({ attrs })}
											<div class="space-y-1">
												<Label asChild={true}>
													<label class="label" for="address_country">
														<span>Country</span>
													</label>
												</Label>
												<select
													{...attrs}
													id="address_country"
													class="select"
													bind:value={$accountDetailsFormData.address_country}
												>
													{#each supportedCountries as country}
														{#if user.addressCountry === country}
															<option selected value={country}>{country}</option>
														{:else}
															<option value={country}>{country}</option>
														{/if}
													{/each}
												</select>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={accountDetailsForm} name="vat_id">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="vat_id">
													<span>VAT ID</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.vat_id}
												id="vat_id"
												placeholder={user.vatId !== '' ? user.vatId : 'optional'}
												class="input"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="phone_number">
									<Control let:attrs>
										<div class="space-y-1">
											<Label asChild={true}>
												<label class="label" for="phone_number">
													<span>Phone number</span>
												</label>
											</Label>
											<input
												{...attrs}
												bind:value={$accountDetailsFormData.phone_number}
												id="phone_number"
												placeholder={user.phoneNumber !== '' ? user.phoneNumber : 'optional'}
												class="input"
											/>
										</div>
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<button type="submit" class="btn preset-soft-primary">
							{#if $accountDetailsFormDelayed}
								<Loader2 class="size-6 animate-spin" />
							{:else}
								Update details
							{/if}
						</button>
					</div>
				</form>
			</div>
		</section>
		<section class="space-y-4">
			<h5 class="h5">Email</h5>

			<div class="p-2 flex place-items-start md:items-center flex-col md:flex-row w-full">
				<form action="/settings/account/?/updateEmail" method="post" use:changeEmailFormEnhance>
					<div class="space-y-4 md:space-y-6">
						<div>
							<Field form={changeEmailForm} name="email">
								<Control let:attrs>
									<div class="space-y-1">
										<Label asChild={true}>
											<label class="label" for="email">
												<span>New email</span>
											</label>
										</Label>
										<input
											{...attrs}
											bind:value={$changeEmailFormData.email}
											id="email"
											class="input"
										/>
									</div>
								</Control>
								<FieldErrors class="text-error-500" />
							</Field>
						</div>
					</div>

					<button type="submit" class="btn preset-soft-primary mt-4">
						{#if $changeEmailFormDelayed}
							<Loader2 class="size-6 animate-spin" />
						{:else}
							Update email
						{/if}
					</button>
				</form>
			</div>
		</section>
	</div>
</div>
