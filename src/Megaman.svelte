<script>
    import { onMount } from 'svelte';
	import bluebird from 'bluebird';
    import { setIntervalAsync } from 'set-interval-async/dynamic';

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

    function handleKeyup(event) {
        key = "";
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
			const loopSheet = async () => {
				for (let i=0;i<2;i++){
					for (let ii=0;ii<5;ii++) {
						let position;
                        
                        if (key == "ArrowLeft" || key == "ArrowRight") {
                            // Key is down, draw nexy frame
                            context.resetTransform();
                            position = spritePositionToImagePosition(i, ii);
                        } else {
                            // No key down, preserve direction, but draw resting sprite
                            position = spritePositionToImagePosition(0, 0);
                        }

						if (key == "ArrowLeft") {
                            // Invert image to appear walking left
							context.translate(canvas.width, 0);
							context.scale(-1, 1);
						}

                        context.drawImage(this, position.x,position.y, SPRITE_WIDTH, SPRITE_HEIGHT, 0, 0, canvas.width, canvas.height);
                        await bluebird.delay(100);
					}
				}
			};
            setIntervalAsync(loopSheet, 100);
		}
	});

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>
<canvas bind:this={canvas}></canvas>

<style>
    canvas {
		image-rendering: pixelated;
		width: 100px;
		height: 100px;
	}
</style>