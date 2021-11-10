<script>
    import { onMount, onDestroy, setContext } from 'svelte';

    import {
		key,
		width,
		height,
		canvas as canvasStore,
		context as contextStore,
		pixelRatio,
		props,
		time
	} from './game.js';

    let canvas;
	let context;
	$: outerWidth = 0;
	$: innerWidth = 0;
	$: outerHeight = 0;
	$: innerHeight = 0;

    onMount(async () => {
        canvas.setAttribute('width', innerWidth);
        canvas.setAttribute('height', innerHeight);
        canvasStore.set(canvas);
        
		context = canvas.getContext('2d', {alpha: true});
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        contextStore.set(context);
    });

</script>

<canvas bind:this={canvas} ></canvas>
<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight/>

<style>
    canvas {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
	}
</style>
<slot></slot>