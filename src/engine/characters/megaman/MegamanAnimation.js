import _ from "lodash";
import Animation from "src/engine/Animation.js";

class MegamanAnimation extends Animation {
    static vf = 20;
    static name = "megaman";
    constructor() {
        super();
        this.frameProgress = 0;
        this.frameUpdateRate = 2;
    }

    incrementSheet(image) {
        const {rows, columns} = image;
        let ended = false;
        if (this.sheet.i >= rows-1 && this.sheet.ii >= columns-1) {
            // End of sheet
            this.sheet.i = 0;
            this.sheet.ii = 0;
            ended = true;
        } else if (this.sheet.ii >= columns-1) {
            // End of row
            this.sheet.i += 1;
            this.sheet.ii = 0;
        } else {
            // End of column
            this.sheet.ii += 1;
        }
        return ended;
    }

    getSheet(image) {
        if (image.rows > this.sheet.i
            && image.columns > this.sheet.ii) return this.sheet;
        
        this.sheet.i = 0;
        this.sheet.ii = 0;
        return this.sheet;
    }

    static spriteCoordinates(row, col, sprite) {
        // https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
        const borderWidth = sprite.borderWidth || 0;
        const spriteWidth = sprite.spriteWidth || 0;
        const spriteHeight = sprite.spriteHeight || 0;
        const spacingWidth = sprite.spacingWidth || 0;
        return {
            x: (
                borderWidth +
                col * (spacingWidth + spriteWidth)
            ),
            y: (
                borderWidth +
                row * (spacingWidth + spriteHeight)
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
}

export default MegamanAnimation;