<script>
    import { onMount } from 'svelte';
	import bluebird from 'bluebird';
    import { setIntervalAsync } from 'set-interval-async/dynamic';
    import { props, renderable } from './game.js';

    let context;
    let canvas;
	let key = null;
    let characterDirection;
    let characterPosition = {x: 0, y: 100};
    $: keyDown = (key != null);
    $: isRunning = (keyDown == true && (key == "ArrowLeft" || key == "ArrowRight"));

    function spritePositionToImagePosition(row, col, sprite) {
        // https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
		return {
			x: (
				sprite.BORDER_WIDTH +
				col * (sprite.SPACING_WIDTH + sprite.SPRITE_WIDTH)
			),
			y: (
				sprite.BORDER_WIDTH +
				row * (sprite.SPACING_WIDTH + sprite.SPRITE_HEIGHT)
			)
		}
	}

    class Standing {
        constructor() {
            this.SPRITE_WIDTH = 46;
            this.SPRITE_HEIGHT = 46;
            this.BORDER_WIDTH = 0;
            this.SPACING_WIDTH = 0;           
        }

        load() {
            if (this.image) return Promise.resolve();

            return new Promise((res, rej) => {
                const image = new Image();
                image.src = "/megaman/standing.png";
                image.onload = drawImage;
                const _this = this;
                async function drawImage() {
                    _this.image = this;
                    res (this);
                }
            });
        }

        async draw() {
			// canvas.width = this.image.naturalWidth;
  			// canvas.height = this.image.naturalHeight;
            context.resetTransform();
            let x = characterPosition.x;

            if (characterDirection == "left") {
                // Invert image to appear walking left
                // context.translate(characterPosition.x+150, 0);
                context.scale(-1, 1);
                x -= characterPosition.x*2 + 100;
            }

            // context.clearRect(x,characterPosition.y,110,110);
            context.drawImage(this.image, -10,-10, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
        }
    }

    class Running {
        constructor() {
            this.SPRITE_WIDTH = 110;
            this.SPRITE_HEIGHT = 116;
            this.BORDER_WIDTH = 0;
            this.SPACING_WIDTH = 0;
            this.sheet = {
                i: 0,
                ii: 0
            };
        }

        load() {
            if (this.image) return Promise.resolve();
            
            return new Promise((res, rej) => {
                const image = new Image();
                image.src = "/megaman/running.png";
                image.onload = drawImage;

                const _this = this;
                async function drawImage() {
                    _this.image = this;
                    res (this);
                }
            });
        }

        async draw() {
			// canvas.width = this.image.naturalWidth;
  			// canvas.height = this.image.naturalHeight;            
            let position;
            let x = characterPosition.x;
            context.resetTransform();

            if (keyDown) {
                // Key is down, draw next frame
                position = spritePositionToImagePosition(this.sheet.i, this.sheet.ii, this);
            } else {
                // No key down, draw resting sprite
                position = spritePositionToImagePosition(0, 0, this);
            }

            if (characterDirection == "left") {
                // Invert image to appear walking left
                // context.translate(characterPosition.x + 100, 0);
                context.scale(-1, 1);
                x -= characterPosition.x*2 + 100;
                characterPosition.x -= 10;
            } else {
                characterPosition.x += 10;
            }
            // context.clearRect(x,characterPosition.y,110,110);
            context.drawImage(this.image, position.x,position.y, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
            context.resetTransform();

            this.incrementSheet();
        }

        incrementSheet() {
            if (this.sheet.i >= 1 && this.sheet.ii >= 4) {
                // End of sheet
                this.sheet.i = 0;
                this.sheet.ii = 0;
            } else if (this.sheet.ii >= 4) {
                // End of row
                this.sheet.i += 1;
                this.sheet.ii = 0;
            } else {
                // End of column
                this.sheet.ii += 1;
            }
        }
    }

    let running = new Running();
    let standing = new Standing();

    function handleKeydown(event) {
		key = event.key;
        if (key == "ArrowLeft") characterDirection = "left";
        if (key == "ArrowRight") characterDirection = "right";
	}

    function handleKeyup(event) {
        key = null;
    }


    renderable(async (props, dt) => {
        await running.load();
        await standing.load();


        canvas = props.canvas;
        context = props.context;

        if (isRunning) running.draw();
        if (!isRunning) standing.draw();
    })

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>