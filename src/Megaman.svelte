<script>
    import { renderable } from './game.js';
    import _ from "lodash";
    let context;
    let canvas;
    let colliders;
	let keys = [];
    let characterDirection;
    let characterPosition = {x: 0, y: 100};
    $: keyDown = (keys.length > 0);
    $: isRunning = (keyDown == true && (_.includes(keys, "a") || _.includes(keys, "d")));

    let jumpingTime = 0;
    const vf = 20;
    const characterVelocity = {x: 0, y: () => {
        if (jumpingTime > vf || jumpingTime == 0 ) {
            jumpingTime = 0;
            return -vf;
        }
        jumpingTime ++;
        return vf - jumpingTime;
    }}

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

    class MegamanAnimation {
        load() {
            if (this.image) return Promise.resolve();

            return new Promise((res, rej) => {
                const image = new Image();
                image.src = this.imageURL;
                image.onload = drawImage;
                const _this = this;
                async function drawImage() {
                    _this.image = this;
                    res (this);
                }
            });
        }

        static checkCollision() {
            let isInCollider = (collider) => {
                if (collider.x1 > characterPosition.x+50) return false;
                if (collider.x2 < characterPosition.x+50) return false;
                if (collider.y1 > characterPosition.y+100) return false;
                if (collider.y2 < characterPosition.y) return false;
                return true;
            }
            for (let collider of colliders) {
                if (!isInCollider(collider)) continue
                if (collider.y1 <= characterPosition.y+100) return {hit: true, collider};
                if (collider.y2 >= characterPosition.y+100) return {hit: true, collider};
            }
            return {hit: false};
        }
    }

    class Jumping extends MegamanAnimation {
        constructor() {
            super();
            this.SPRITE_WIDTH = 46;
            this.SPRITE_HEIGHT = 46;
            this.BORDER_WIDTH = 0;
            this.SPACING_WIDTH = 0;
            this.imageURL = "/megaman/jumping.png";         
        }

        async draw() {
            let x = characterPosition.x;

            if (characterDirection == "left") {
                // Invert image to appear walking left
                // context.translate(characterPosition.x+150, 0);
                context.scale(-1, 1);
                x -= characterPosition.x*2 + 100;
            }

            context.drawImage(this.image, -10,-10, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
            context.resetTransform();
        }
    }

    class Standing extends MegamanAnimation {
        constructor() {
            super();
            this.SPRITE_WIDTH = 46;
            this.SPRITE_HEIGHT = 46;
            this.BORDER_WIDTH = 0;
            this.SPACING_WIDTH = 0;
            this.imageURL = "/megaman/standing.png";         
        }

        async draw() {
            let x = characterPosition.x;

            if (characterDirection == "left") {
                // Invert image to appear walking left
                // context.translate(characterPosition.x+150, 0);
                context.scale(-1, 1);
                x -= characterPosition.x*2 + 100;
            }

            context.drawImage(this.image, -10,-10, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
            context.resetTransform();
        }
    }

    class Running extends MegamanAnimation {
        constructor() {
            super();
            this.SPRITE_WIDTH = 110;
            this.SPRITE_HEIGHT = 116;
            this.BORDER_WIDTH = 0;
            this.SPACING_WIDTH = 0;
            this.sheet = {
                i: 0,
                ii: 0
            };
            this.imageURL = "/megaman/running.png";
        }

        async draw() {        
            let position;
            let x = characterPosition.x;
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
    let jumping = new Jumping();

    function handleKeydown(event) {
        const newKey = event.key;
        keys = [...keys, newKey];

        if (newKey == "w") {
            if (jumpingTime <= 0) {
                jumpingTime = 1;
                characterPosition.y -= 1;
            }
        }

        if (newKey == "a") characterDirection = "left";
        if (newKey == "d") characterDirection = "right";
	}

    function handleKeyup(event) {
        const oldKey = event.key;
        keys = [..._.without(keys, oldKey)]
    }

    renderable(async (props, dt) => {
        await running.load();
        await standing.load();
        await jumping.load();

        canvas = props.canvas;
        context = props.context;
        colliders = props.colliders;

        context.resetTransform();
        let collision = MegamanAnimation.checkCollision();
        let v = characterVelocity.y();
        if (!collision.hit) characterPosition.y -= v;
        if (collision.hit)characterPosition.y = collision.collider.y1-100;
        
        if (!collision.hit) jumping.draw()

        if (isRunning && characterDirection == "left") characterPosition.x -= 10;
        if (isRunning && characterDirection == "right") characterPosition.x += 10;
        if (isRunning && collision.hit) running.draw();
        if (!isRunning && collision.hit) standing.draw();
    })

</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>