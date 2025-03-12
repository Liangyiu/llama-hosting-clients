// See https://svelte.dev/docs/kit/types#app.d.ts

import type { TypedPocketBase } from '$lib/types/pocketbase-types';
import type { AuthRecord } from 'pocketbase';

interface ExtPageData {
	crumbs?: Array<{ title: string; url?: string }>;
}

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: TypedPocketBase;
			user: AuthRecord;
		}
		interface PageData {
			extra?: ExtPageData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
