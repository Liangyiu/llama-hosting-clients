import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import type { Schema } from '$lib/pocketbase/PB-Schema';
import { TypedPocketBase } from 'typed-pocketbase';

export const pbAdmin = new TypedPocketBase<Schema>(
	dev ? envPublic.PUBLIC_DEV_POCKETBASE_URL : envPublic.PUBLIC_POCKETBASE_URL
);

pbAdmin.autoCancellation(false);

// the credentials can be filled via env variables

await pbAdmin.admins.authWithPassword(env.SECRET_POCKETBASE_EMAIL, env.SECRET_POCKETBASE_PW, {
	// This will trigger auto refresh or auto reauthentication in case
	// the token has expired or is going to expire in the next 30 minutes.
	autoRefreshThreshold: 30 * 60
});
