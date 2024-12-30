import { sentrySvelteKit } from '@sentry/sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'llama-it',
				project: 'llama-hosting-clients',
				url: 'https://glitch.coolify.llama.onl'
			}
		}),
		sveltekit(),
		purgeCss(),
		Icons({
			compiler: 'svelte'
		})
	]
});
