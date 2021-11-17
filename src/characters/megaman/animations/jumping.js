import MegamanAnimation from "../MegamanAnimation";
class Jumping extends MegamanAnimation {
    constructor() {
        super();
        this.SPRITE_WIDTH = 46;
        this.SPRITE_HEIGHT = 46;
        this.BORDER_WIDTH = 0;
        this.SPACING_WIDTH = 0;
        this.imageURLS = [
            {url: "/megaman/jumping.png", name: "jumping"}
        ]; 
    }

    async draw(characterPosition, characterDirection) {
        let x = characterPosition.x;

        if (characterDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= characterPosition.x*2 + 100;
        }

        this.context.drawImage(this.images["jumping"].image, -10,-10, this.SPRITE_WIDTH, this.SPRITE_HEIGHT, x, characterPosition.y, 100, 100);
        this.context.resetTransform();
    }
}

export default new Jumping();
