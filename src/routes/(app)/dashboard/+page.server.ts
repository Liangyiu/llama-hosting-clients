import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { pb }
		} = event;

		pb.authStore.clear();

		return redirect(303, '/login?logout=true');
	}
};
