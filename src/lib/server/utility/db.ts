import { Collections, type UsersResponse } from '$lib/types/pocketbase-types';
import pbAdmin from '../pb-admin';

interface ITotpEnabledConfig {
	userId?: string;
	userEmail?: string;
}
export async function hasTotpEnabled(
	config: ITotpEnabledConfig = { userEmail: undefined, userId: undefined }
) {
	const { userEmail, userId } = config;

	if (!userId && !userEmail) {
		return false;
	}

	if (userId) {
		const user = await pbAdmin.collection(Collections.Users).getOne<UsersResponse>(userId);

		if (user.mfa_totp) {
			return true;
		} else {
			return false;
		}
	}

	if (userEmail) {
		const user = await pbAdmin
			.collection(Collections.Users)
			.getFirstListItem<UsersResponse>(
				pbAdmin.filter('email = {:email}', { email: userEmail.toLowerCase() })
			);

		if (user.mfa_totp) {
			return true;
		} else {
			return false;
		}
	}
}
