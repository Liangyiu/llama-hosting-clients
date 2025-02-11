import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { env as envPublic } from '$env/dynamic/public';
import { Collections, type TypedPocketBase } from '$lib/types/pocketbase-types';
import Pocketbase from 'pocketbase';

export const pbAdmin = new Pocketbase(
	dev ? envPublic.PUBLIC_DEV_POCKETBASE_URL : envPublic.PUBLIC_POCKETBASE_URL
) as TypedPocketBase;

pbAdmin.autoCancellation(false);

await pbAdmin
	.collection(Collections.Superusers)
	.authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PW, {
		// This will trigger auto refresh or auto reauthentication in case
		// the token has expired or is going to expire in the next 30 minutes.
		autoRefreshThreshold: 30 * 60
	});
