// https://svelte.dev/repl/79f4f3e0296a403ea988f74d332a7a4a?version=3.12.1

import { getContext, onMount } from 'svelte';
import { writable, derived } from 'svelte/store';

// Some props for the app
export const width = writable(window.innerWidth);
export const height = writable(window.innerHeight);
export const pixelRatio = writable(window.devicePixelRatio);
export const context = writable();
export const canvas = writable();
export const time = writable(0);
export const colliders = writable([]);

// A more convenient store for grabbing all game props
export const props = deriveObject({
	context,
	canvas,
	width,
	height,
	pixelRatio,
	time,
    colliders
});

export const key = Symbol();

export const getState = () => {
	const api = getContext(key);
	return api.getState();
};

export const renderable = (render) => {
	const api = getContext(key);
	const element = {
		ready: false,
		mounted: false
	};
	if (typeof render === 'function') element.render = render;
	else if (render) {
		if (render.render) element.render = render.render;
		if (render.setup) element.setup = render.setup;
	}
	api.add(element);
	onMount(() => {
		element.mounted = true;
		element.elementReady();
		element.elementReady = null;
		return () => {
			api.remove(element);
			element.mounted = false;
		};
	});
}

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