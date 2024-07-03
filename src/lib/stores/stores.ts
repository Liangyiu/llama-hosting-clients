import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const themeStore = writable(
	browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton'
);

export const activeSettingsSection = writable('Account');
