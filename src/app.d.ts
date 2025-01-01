// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { TypedPocketBase, UsersRecord } from '$lib/types/pocketbase-types';
import type { AuthRecord } from 'pocketbase';

declare global {
	namespace App {
		interface Error {
			errorId: string;
		}
		interface Locals {
			pb: TypedPocketBase;
			user: AuthRecord<UsersRecord>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
