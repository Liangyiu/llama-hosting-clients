import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { createAuthClient } from 'better-auth/svelte';
import { magicLinkClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: dev ? 'http://localhost:5173' : env.PUBLIC_BASE_URL || env.PUBLIC_ORIGIN,
	plugins: [magicLinkClient()]
});
