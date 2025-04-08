import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import pbAdmin from '$lib/server/pb-admin';
import { Collections, type UserDetailsResponse } from '$lib/types/pocketbase-types';
import { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals }) => {
	const { session, user } = locals;

	if (!session || !user) {
		throw redirect(302, '/login');
	}

	try {
		const userDetails = await pbAdmin
			.collection(Collections.UserDetails)
			.getOne<UserDetailsResponse>(user.id);

		return { userDetails, newUser: false };
	} catch (error) {
		const { status } = error as ClientResponseError;
		if (status === 404) {
			return { userDetails: undefined, newUser: true };
		}
	}
}) satisfies LayoutServerLoad;
