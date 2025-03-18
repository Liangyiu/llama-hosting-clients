import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export function styleToString(style: Record<string, number | string | undefined>): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return `${str}${key}:${style[key]};`;
	}, '');
}

export function flyAndScale(
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
}

export const supportedCountriesList = [
	'Australia',
	'Austria',
	'Belgium',
	'Bosnia and Herzegovina',
	'Bulgaria',
	'Belarus',
	'Canada',
	'Croatia',
	'Cyprus',
	'Czech Republic',
	'Denmark',
	'Estonia',
	'Faroe Islands',
	'Finland',
	'France',
	'Georgia',
	'Germany',
	'Greece',
	'Hungary',
	'Iceland',
	'Ireland',
	'Italy',
	'Latvia',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Malta',
	'Monaco',
	'Netherlands',
	'Norway',
	'Poland',
	'Portugal',
	'Romania',
	'Serbia',
	'Slovakia',
	'Slovenia',
	'Spain',
	'Sweden',
	'Switzerland',
	'Ukraine',
	'United Kingdom',
	'Isle of Man',
	'United States'
] as const;

export function getCountryId(country: string) {
	switch (country) {
		case 'Australia':
			return 36;
		case 'Austria':
			return 40;
		case 'Belgium':
			return 56;
		case 'Bosnia and Herzegovina':
			return 70;
		case 'Bulgaria':
			return 100;
		case 'Belarus':
			return 112;
		case 'Canada':
			return 124;
		case 'Croatia':
			return 191;
		case 'Cyprus':
			return 196;
		case 'Czech Republic':
			return 203;
		case 'Denmark':
			return 208;
		case 'Estonia':
			return 233;
		case 'Faroe Islands':
			return 234;
		case 'Finland':
			return 246;
		case 'France':
			return 250;
		case 'Georgia':
			return 268;
		case 'Germany':
			return 276;
		case 'Greece':
			return 300;
		case 'Hungary':
			return 348;
		case 'Iceland':
			return 352;
		case 'Ireland':
			return 372;
		case 'Italy':
			return 380;
		case 'Latvia':
			return 428;
		case 'Liechtenstein':
			return 438;
		case 'Lithuania':
			return 440;
		case 'Luxembourg':
			return 442;
		case 'Malta':
			return 470;
		case 'Monaco':
			return 492;
		case 'Netherlands':
			return 528;
		case 'Norway':
			return 578;
		case 'Poland':
			return 616;
		case 'Portugal':
			return 620;
		case 'Romania':
			return 642;
		case 'Serbia':
			return 688;
		case 'Slovakia':
			return 703;
		case 'Slovenia':
			return 705;
		case 'Spain':
			return 724;
		case 'Sweden':
			return 752;
		case 'Switzerland':
			return 756;
		case 'Ukraine':
			return 804;
		case 'United Kingdom':
			return 826;
		case 'Isle of Man':
			return 833;
		case 'United States':
			return 840;
		default:
			return 0;
	}
}

export async function waitFor(timeMs: number) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve('');
		}, timeMs);
	});
}
