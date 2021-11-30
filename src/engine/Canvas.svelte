<!-- https://svelte.dev/repl/79f4f3e0296a403ea988f74d332a7a4a?version=3.12.1 -->
<script>
	import { onMount, onDestroy, setContext } from 'svelte';
	import _ from "lodash";
	import {
		key,
		width,
		height,
		canvas as canvasStore,
		context as contextStore,
		colliders as collidersStore,
		pixelRatio,
		props,
		time
	} from 'src/stores/engine.js';

	export let killLoopOnError = true;
	export let attributes = {};
	
	let listeners = [];
	let canvas;
	let context;
	let frame;
	let minScreen;

	let elementReady = () => {
		// prepare canvas stores
		context = canvas.getContext('2d', attributes);
		canvasStore.set(canvas);
		contextStore.set(context);

		// setup entities
		listeners.forEach(async entity => {
			if (entity.setup) {
				let p = entity.setup($props);
				if (p && p.then) await p;
			}
			entity.ready = true;
		});
		
	}

	onMount(() => {
		minScreen = _.min([window.innerWidth, window.innerHeight]);

		// start game loop
		return createLoop((elapsed, dt) => {
			time.set(elapsed);
			render(dt);
		});
	});
	
	setContext(key, {
		add (fn) {
			fn.elementReady = elementReady;
			this.remove(fn);
			listeners.push(fn);
		},
		remove (fn) {
			const idx = listeners.indexOf(fn);
			if (idx >= 0) listeners.splice(idx, 1);
		}
	});
	
	function render (dt) {
		context.save();
		context.scale($pixelRatio, $pixelRatio);
		listeners.forEach(entity => {
			try {
				if (entity.mounted && entity.ready && entity.render) {
					entity.render($props, dt);
				}
			} catch (err) {
				console.error(err);
				if (killLoopOnError) {
					cancelAnimationFrame(frame);
					console.warn('Animation loop stopped due to an error');
				}
			}
		});
		context.restore();
	}
	
	function handleResize () {
		width.set(window.innerWidth);
		height.set(window.innerHeight);
		minScreen = _.min([window.innerWidth, window.innerHeight]);
		pixelRatio.set(window.devicePixelRatio);
	}
	
    
	function createLoop (fn) {
		let elapsed = 0;
		let lastTime = performance.now();
        let counter = 0;
		(function loop() {
            counter ++;
			frame = requestAnimationFrame(loop);
			if (counter % 2 != 0) return;
            const beginTime = performance.now();
			const dt = (beginTime - lastTime) / 1000;
			lastTime = beginTime;
			elapsed += dt;
			fn(elapsed, dt);
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}

	let padding = 10;
</script>

<canvas
	bind:this={canvas}
	width={minScreen * $pixelRatio - padding}
	height={minScreen * $pixelRatio - padding}
	style="width: {minScreen - 2*padding}px; height: {minScreen - 2*padding}px; padding: {padding}px"
/>
<svelte:window on:resize|passive={handleResize} />
<slot></slot>

<style>
    canvas {
        margin: 0 auto;
        position: relative;
    }
</style>