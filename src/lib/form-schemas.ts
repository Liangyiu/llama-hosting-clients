import { z } from 'zod';

export const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'Must be a valid email' })
});

export const loginSchema = z.object({
	email: z.string().email({ message: 'Must be a valid email' }),
	password: z.string().min(8, { message: 'Must be at least 8 characters long' })
});

export const registerSchema = z
	.object({
		first_name: z.string().min(3, { message: 'Please enter a valid name' }),
		last_name: z.string().min(3, { message: 'Please enter a valid name' }),
		email: z.string().email({ message: 'Must be a valid email' }),
		password: z
			.string()
			.min(8, { message: 'Must be at least 8 characters long' })
			.max(64, { message: 'Can not exceed 64 characters' }),
		passwordConfirm: z.string(),
		accept_terms: z.boolean()
	})
	.superRefine(({ password }, checkPasswordComplexity) => {
		const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
		const containsLowercase = (ch: string) => /[a-z]/.test(ch);
		const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
		let countOfUpperCase = 0,
			countOfLowerCase = 0,
			countOfNumbers = 0,
			countOfSpecialChar = 0;
		for (let i = 0; i < password.length; i++) {
			let ch = password.charAt(i);
			if (!isNaN(+ch)) countOfNumbers++;
			else if (containsUppercase(ch)) countOfUpperCase++;
			else if (containsLowercase(ch)) countOfLowerCase++;
			else if (containsSpecialChar(ch)) countOfSpecialChar++;
		}
		if (
			countOfLowerCase < 1 ||
			countOfUpperCase < 1 ||
			countOfSpecialChar < 1 ||
			countOfNumbers < 1
		) {
			checkPasswordComplexity.addIssue({
				code: 'custom',
				message: 'Must contain at least one of each (lower case, upper case, special, number)',
				path: ['password']
			});
		}
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords do not match',
		path: ['passwordConfirm']
	})
	.refine((data) => data.accept_terms === true, {
		message: 'You need to accept to proceed',
		path: ['accept_terms']
	});

export const avatarSchema = z.object({
	avatar: z
		.instanceof(File, { message: 'Please upload a file' })
		.refine((file) => file.size < 5_000_000, 'Max 5 MB file size')
});
