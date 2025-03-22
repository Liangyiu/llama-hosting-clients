import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createAuthClient } from 'better-auth/svelte'; // make sure to import from better-auth/svelte

export const authClient = createAuthClient({
	baseURL: dev ? 'http://localhost:5173' : env.ORIGIN!
});
