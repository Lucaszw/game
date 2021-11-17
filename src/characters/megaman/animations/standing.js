import MegamanAnimation from "../MegamanAnimation";

class Standing extends MegamanAnimation {
    constructor() {
        super();
        this.SPRITE_WIDTH = 46;
        this.SPRITE_HEIGHT = 46;
        this.BORDER_WIDTH = 0;
        this.SPACING_WIDTH = 0;
        this.imageURLS = [
            {
                url: "/megaman/standing.png", 
                name: "standing",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 1 
            },
            {
                url: "/megaman/standing-gun.png", 
                name: "standing-gun",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                offsetX: 0,
                offsetY: 0,
                rows: 1,
                columns: 1
            }
        ]
    }

    async draw(characterPosition, characterDirection, showGun=false) {
        let x = characterPosition.x;
        let image = this.images[showGun ? "standing-gun" : "standing"];

        if (characterDirection.x == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= characterPosition.x*2 + 100;
        }

        this.context.drawImage(image.image, -10,-10, image.spriteWidth, image.spriteHeight, x, characterPosition.y, 100, 100);
        this.context.resetTransform();
    }
}

export default new Standing();