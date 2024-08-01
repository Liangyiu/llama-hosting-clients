import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { accountDetailsSchema, avatarSchema, changeEmailSchema } from '$lib/form-schemas';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const load = (async () => {
	return {
		avatarForm: await superValidate(zod(avatarSchema)),
		accountDetailsForm: await superValidate(zod(accountDetailsSchema)),
		emailChangeForm: await superValidate(zod(changeEmailSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	uploadAvatar: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(avatarSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pb.collection('user_details').update(user.user_details, form.data);

			return message(form, {
				status: 200,
				message: 'Avatar uploaded successfully. Refresh to see changes.'
			});
		} catch (e) {
			const { status } = e as ClientResponseError;
			return message(form, {
				status: status,
				message: 'An error occurred during avatar upload'
			});
		}
	},
	removeAvatar: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		try {
			return await pb.collection('user_details').update(user.user_details, {
				avatar: null
			});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (_) {
			return redirect(303, '/settings/account?error=An+error+occurred+during+avatar+removal');
		}
	},
	updateAccountDetails: async (event) => {
		const {
			locals: { pb, user }
		} = event;

		const form = await superValidate(event, zod(accountDetailsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pb.collection('user_details').update(user.user_details, form.data);
			return message(form, {
				status: 200,
				message: 'Account details updated successfully'
			});
		} catch (e) {
			const { status } = e as ClientResponseError;
			return message(form, {
				status: status,
				message: 'An error occurred during account details update'
			});
		}
	},
	updateEmail: async (event) => {
		const {
			locals: { pb }
		} = event;

		const form = await superValidate(event, zod(changeEmailSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pb.collection('users').requestEmailChange(form.data.email);
			return message(form, {
				status: 200,
				message: 'An email has been sent to ' + form.data.email
			});
		} catch (e) {
			const { status } = e as ClientResponseError;
			return message(form, {
				status: status,
				message: 'An error occurred during the email change process'
			});
		}
	}
};
