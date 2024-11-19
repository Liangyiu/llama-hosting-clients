<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { setUserState } from '$lib/stores/userStore';

	let { data, children } = $props();

	if (data.user) {
		setUserState({
			email: data.user.email,
			firstName: data.user.first_name,
			lastName: data.user.last_name,
			user: data.user.id,
			avatar: data.userDetails?.avatar,
			avatarUrl: data.avatarUrl,
			addressCity: data.userDetails?.address_city,
			addressCountry: data.userDetails?.address_country,
			addressLineOne: data.userDetails?.address_line_one,
			addressLineTwo: data.userDetails?.address_line_two,
			addressStateProvince: data.userDetails?.address_state_province,
			addressPostalCode: data.userDetails?.address_postal_code,
			defaultSshKeys: data.userDetails?.default_ssh_keys,
			phoneNumber: data.userDetails?.phone_number,
			vatId: data.userDetails?.vat_id,
			mfaTotp: data.user?.mfa_totp ?? false,
			mfaTotpSecretId: data.user?.mfa_totp_secret_id
		});
	}
</script>

<div class="min-h-screen">
	<Navigation />

	<main class="h-full min-h-screen pt-[80px] lg:pl-56">
		<div class="p-4 mx-auto max-w-[1450px] border h-full min-h-full md:h-full">
			{@render children?.()}
		</div>
	</main>
</div>
