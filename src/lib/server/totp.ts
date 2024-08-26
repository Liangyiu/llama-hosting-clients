import { pbAdmin } from './pb-admin';
import { TOTP } from 'otpauth';

export async function validateTotpCode(secretId: string, code: string) {
	if (code.length !== 6) {
		return {
			success: false,
			message: 'Invalid TOTP code',
			status: 400
		};
	}

	try {
		const totpSecret = await pbAdmin.from('user_mfa_totp_secrets').getOne(secretId);

		if (!totpSecret) {
			return {
				success: false,
				message: 'TOTP not activated',
				status: 400
			};
		}

		const totp = new TOTP({
			secret: totpSecret.secret,
			algorithm: 'SHA1',
			digits: 6,
			period: 30
		});

		const delta = totp.validate({
			token: code,
			window: 1
		});

		if (delta === null) {
			return {
				success: false,
				message: 'TOTP code invalid',
				status: 498
			};
		} else {
			return {
				success: true,
				message: 'TOTP code valid',
				status: 200
			};
		}
	} catch {
		return {
			success: false,
			message: 'An error occurred during TOTP validation',
			status: 500
		};
	}
}
