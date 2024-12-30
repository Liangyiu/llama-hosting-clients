<script lang="ts">
	import { accountDetailsSchema, avatarSchema, changeEmailSchema } from '$lib/form-schemas';
	import { getUserState } from '$lib/stores/UserStore.svelte.js';
	import { supportedCountriesList } from '$lib/utils';
	import { Control, Field, FieldErrors, Label } from 'formsnap';
	import Loader2 from '~icons/lucide/loader2';
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Avatar } from '@skeletonlabs/skeleton-svelte';

	import { toast as sonner } from 'svelte-sonner';

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
				sonner.success(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
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
				sonner.success(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
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
				sonner.success(m.message);
			} else if (m.status === 429) {
				sonner.error(m.message);
			} else {
				sonner.error(m.message);
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
							<Control>
								{#snippet children({ props })}
									<input
										{...props}
										type="file"
										name="avatar"
										id="avatarInput"
										accept="image/png, image/jpeg"
										bind:files={$avatarFile}
										class="input preset-outlined w-full"
										onchange={() => onFileSelected()}
									/>
								{/snippet}
							</Control>
							<FieldErrors class="text-error-500" />
						</Field>
						{#if $avatarFile.length > 0}
							<button type="submit" class="btn preset-outlined-primary-500 w-full mt-4">
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
								class="btn preset-outlined-error-500 w-full"
								disabled={!customAvatarSet}>Remove avatar</button
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
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="first_name">
															<span class="label-text">First name</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.first_name}
													id="first_name"
													placeholder={user.firstName}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="last_name">
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="last_name">
															<span class="label-text">Last name</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.last_name}
													id="last_name"
													placeholder={user.lastName}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<div>
							<Field form={accountDetailsForm} name="address_line_one">
								<Control>
									{#snippet children({ props })}
										<div class="space-y-1">
											<Label>
												{#snippet child({ props })}
													<label {...props} class="label" for="address_line_one">
														<span class="label-text">Address Line 1</span>
													</label>
												{/snippet}
											</Label>
											<input
												{...props}
												bind:value={$accountDetailsFormData.address_line_one}
												id="address_line_one"
												placeholder={user.addressLineOne !== ''
													? user.addressLineOne
													: 'e.g. Example Street 5'}
												class="input preset-outlined"
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
									{#snippet children({ props })}
										<div class="space-y-1">
											<Label>
												{#snippet child({ props })}
													<label {...props} class="label" for="address_line_two">
														<span class="label-text">Address Line 2</span>
													</label>
												{/snippet}
											</Label>
											<input
												{...props}
												bind:value={$accountDetailsFormData.address_line_two}
												id="address_line_two"
												placeholder={user.addressLineTwo !== ''
													? user.addressLineTwo
													: 'e.g. Apt. 123'}
												class="input preset-outlined"
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
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="address_postal_code">
															<span class="label-text">Postal code</span>
														</label>
														pporpos
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.address_postal_code}
													id="address_postal_code"
													placeholder={user.addressPostalCode !== ''
														? user.addressPostalCode
														: 'e.g. 52066'}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="address_city">
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="address_city">
															<span class="label-text">City</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.address_city}
													id="address_city"
													placeholder={user.addressCity !== '' ? user.addressCity : 'e.g. Aachen'}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Field form={accountDetailsForm} name="address_state_province">
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="address_state_province">
															<span class="label-text">Province/State</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.address_state_province}
													id="address_state_province"
													placeholder={user.addressStateProvince !== ''
														? user.addressStateProvince
														: 'e.g. North Rhine-Westphalia'}
													class="input preset-outlined"
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
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="address_country">
															<span class="label-text">Country</span>
														</label>
													{/snippet}
												</Label>
												<select
													{...props}
													id="address_country"
													class="select preset-outlined"
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
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="vat_id">
															<span class="label-text">VAT ID</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.vat_id}
													id="vat_id"
													placeholder={user.vatId !== '' ? user.vatId : 'optional'}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
							<div>
								<Field form={accountDetailsForm} name="phone_number">
									<Control>
										{#snippet children({ props })}
											<div class="space-y-1">
												<Label>
													{#snippet child({ props })}
														<label {...props} class="label" for="phone_number">
															<span class="label-text">Phone number</span>
														</label>
													{/snippet}
												</Label>
												<input
													{...props}
													bind:value={$accountDetailsFormData.phone_number}
													id="phone_number"
													placeholder={user.phoneNumber !== '' ? user.phoneNumber : 'optional'}
													class="input preset-outlined"
												/>
											</div>
										{/snippet}
									</Control>
									<FieldErrors class="text-error-500" />
								</Field>
							</div>
						</div>
						<button type="submit" class="btn preset-filled-primary-300-700">
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
								<Control>
									{#snippet children({ props })}
										<div class="space-y-1">
											<Label>
												{#snippet child({ props })}
													<label {...props} class="label" for="email">
														<span class="label-text">New email</span>
													</label>
												{/snippet}
											</Label>
											<input
												{...props}
												bind:value={$changeEmailFormData.email}
												id="email"
												class="input preset-outlined"
											/>
										</div>
									{/snippet}
								</Control>
								<FieldErrors class="text-error-500" />
							</Field>
						</div>
					</div>

					<button type="submit" class="btn preset-filled-primary-300-700 mt-4">
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
