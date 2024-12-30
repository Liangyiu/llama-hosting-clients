import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
	environment: dev ? 'development' : 'production',
	dsn: env.PUBLIC_GLITCHTOP_DSN,
	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [replayIntegration()]
});

const errorId = crypto.randomUUID();
Sentry.setTag('custom_error_id', errorId);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError: HandleClientError = handleErrorWithSentry(() => {
	return {
		message: "An unexpected error occurred. We're working on it!",
		errorId
	};
});
