import MegamanAnimation from '../MegamanAnimation';

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

    async draw(characterPosition, characterDirection) {        
        let x = characterPosition.x;
        let position = MegamanAnimation.spriteCoordinates(this.sheet.i, this.sheet.ii, this);
        if (characterDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x + 100, 0);
            this.context.scale(-1, 1);
            x -= characterPosition.x*2 + 100;
        }
        // context.clearRect(x,characterPosition.y,110,110);
        this.context.drawImage(this.image, position.x,position.y, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
        this.context.resetTransform();

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

export default new Running();