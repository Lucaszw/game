// https://svelte.dev/repl/79f4f3e0296a403ea988f74d332a7a4a?version=3.12.1

import { getContext, onMount, onDestroy } from 'svelte';
import { writable, derived } from 'svelte/store';

export const width = writable(window.innerWidth);
export const height = writable(window.innerHeight);
export const pixelRatio = writable(window.devicePixelRatio);
export const context = writable();
export const canvas = writable();
export const time = writable(0);

export const props = deriveObject({
	context,
	canvas,
	width,
	height,
	pixelRatio,
	time
});

export const key = Symbol();

function deriveObject (obj) {
	const keys = Object.keys(obj);
	const list = keys.map(key => {
		return obj[key];
	});
	return derived(list, (array) => {
		return array.reduce((dict, value, i) => {
			dict[keys[i]] = value;
			return dict;
		}, {});
	});
}