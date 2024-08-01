import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	resetPassword: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		if (!email) {
			error(400, 'Error: Could not send password reset');
		}
		await locals.pb.collection('users').requestPasswordReset(email);
		return redirect(303, '/settings/security?passwordReset=true');
	}
};

// import { error, redirect } from '@sveltejs/kit';
// import type { Actions } from './$types';
// import { message } from 'sveltekit-superforms';
// import type { ClientResponseError } from 'pocketbase';

// export const actions: Actions = {
// 	resetPassword: async ({ locals }) => {
// 		const email = locals.user.email;

// 		try {
// 		await locals.pb.collection('users').requestPasswordReset(email);

// 		} catch (e) {
// 			const {status} = e as ClientResponseError
// 			return message()
// 		}

// 		return redirect(303, '/settings/security?passwordReset=true');
// 	}
// };
