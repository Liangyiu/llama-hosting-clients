// See https://svelte.dev/docs/kit/types#app.d.ts

import type { LogtoClient, UserInfoResponse } from '@logto/sveltekit';

interface ExtPageData {
	crumbs?: Array<{ title: string; url?: string }>;
}

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			logtoClient: LogtoClient;
			user?: UserInfoResponse;
		}
		interface PageData {
			extra?: ExtPageData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
