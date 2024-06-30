import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { pb }
		} = event;

		pb.authStore.clear();

		return redirect(303, '/login?logout=true');
	},
	setTheme: async ({ cookies, request }) => {
		const formData = await request.formData();
		const theme = formData.get('theme')?.toString() ?? 'skeleton';
		// Sets the selected theme to the cookie
		cookies.set('theme', theme, { path: '/' });
		return { theme };
	}
};
