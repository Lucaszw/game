<script>
    import { onMount } from 'svelte';
	import bluebird from 'bluebird';

	let context;
	let key;
    let canvas;

	const SPRITE_WIDTH = 110;
	const SPRITE_HEIGHT = 116;
	const BORDER_WIDTH = 0;
	const SPACING_WIDTH = 0;

    function handleKeydown(event) {
		key = event.key;
	}

	function spritePositionToImagePosition(row, col) {
        // https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
		return {
			x: (
				BORDER_WIDTH +
				col * (SPACING_WIDTH + SPRITE_WIDTH)
			),
			y: (
				BORDER_WIDTH +
				row * (SPACING_WIDTH + SPRITE_HEIGHT)
			)
		}
	}

	onMount(async () => {
		context = canvas.getContext('2d', {alpha: true});

		const image = new Image();
		image.src = "/megaman.jpg";
		image.onload = drawImage;

		async function drawImage() {
			canvas.width = this.naturalWidth;
  			canvas.height = this.naturalHeight;
			while (true) {
				for (let i=0;i<2;i++){
					for (let ii=0;ii<5;ii++) {
						const position = spritePositionToImagePosition(i, ii);
						context.resetTransform();
						if (key == "ArrowLeft") {
							context.translate(canvas.width, 0);
							context.scale(-1, 1);
						}
						context.drawImage(this, position.x,position.y, SPRITE_WIDTH, SPRITE_HEIGHT, 0, 0, canvas.width, canvas.height);
						await bluebird.delay(100);
					}
				}
			}
		}
	});

</script>

<svelte:window on:keydown={handleKeydown}/>
<canvas bind:this={canvas}></canvas>

<style>
    canvas {
		image-rendering: pixelated;
		width: 100px;
		height: 100px;
	}
</style>