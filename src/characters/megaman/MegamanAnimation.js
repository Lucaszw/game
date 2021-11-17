class MegamanAnimation {
    static vf = 20;

    load(context) {
        this.context = context;
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

    static spriteCoordinates(row, col, sprite) {
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

    static characterVelocityX() {
        return 0;
    }

    static characterVelocityY(jumpingTime) {
        const v = MegamanAnimation.vf - jumpingTime;
        if (v <= -20  || jumpingTime == 0 ) {
            jumpingTime = 0;
            return -MegamanAnimation.vf;
        }
        jumpingTime ++;
        return MegamanAnimation.vf - jumpingTime;
    }

    static checkCollision(colliders, characterPosition) {
        let isInCollider = (collider) => {
            if (collider.x1 > characterPosition.x+50) return false;
            if (collider.x2 < characterPosition.x+50) return false;
            if (collider.y1 > characterPosition.y+100) return false;
            if (collider.y2 < characterPosition.y) return false;
            return true;
        }
        for (let collider of colliders) {
            if (!isInCollider(collider)) continue
            let characterBottom = characterPosition.y+100;
            let characterMidpoint = characterPosition.y+80;
            let characterTop = characterPosition.y;

            if (collider.y1 <= characterBottom && collider.y1 > characterMidpoint) return {hit: true, region: "top", y: collider.y1 - 100};
            if (collider.y2 >= characterTop && collider.y2 < characterBottom ) return {hit: true, region: "bottom", y: collider.y2};
        }
        return {hit: false};
    }
    
}

export default MegamanAnimation;