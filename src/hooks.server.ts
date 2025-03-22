import { sequence } from '@sveltejs/kit/hooks';
// import * as Sentry from '@sentry/sveltekit';
import { error, redirect, type HandleServerError } from '@sveltejs/kit';
import crypto from 'crypto';
import { auth } from '$lib/auth'; // path to your auth file

// Sentry.init({
// 	environment: dev ? 'development' : 'production',
// 	dsn: envPublic.PUBLIC_GLITCHTOP_DSN,
// 	tracesSampleRate: 1
// });

const errorId = crypto.randomUUID();

// Sentry.setTag('custom_error_id', errorId);

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Server side error:', error, event);

	return {
		message: "An unexpected error occurred. We're working on it!",
		errorId
	};
};

// export const handleError: HandleServerError = Sentry.handleErrorWithSentry(customErrorHandler);

export const handle = sequence(
	// Sentry.sentryHandle({ handleUnknownRoutes: false }),
	async function _handle({ event, resolve }) {
		const { locals, request, url } = event;

		// better-auth logic
		const session = await auth.api.getSession({
			headers: request.headers
		});
		// Set session and user to locals
		locals.session = session?.session;
		locals.user = session?.user;

		// protect admin route

		if (url.pathname.startsWith('/admin') && locals.user?.role !== 'admin') {
			throw error(403, 'Forbidden');
		}

		// protect routes

		if (
			url.pathname.startsWith('/') &&
			!locals.session &&
			!['/login', '/register', '/reset-password', '/reset-password/success'].includes(url.pathname)
		) {
			return redirect(303, '/login');
		}

		if (url.pathname === '/') {
			return redirect(303, '/dashboard');
		}

		if ((url.pathname === '/settings/' || url.pathname === '/settings') && locals.session) {
			return redirect(303, '/settings/account');
		}

		if (
			url.pathname.startsWith('/') &&
			locals.session &&
			['/login', '/register', '/reset-password', '/reset-password/success'].includes(url.pathname)
		) {
			return redirect(303, '/dashboard');
		}

		const response = await resolve(event);

		return response;
	}
);
