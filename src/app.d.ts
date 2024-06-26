// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { TypedPocketBase, UsersRecord } from '$lib/types/pbTypes';
import type { AuthModel } from 'pocketbase';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase;
			user: AuthModel<UsersRecord> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
