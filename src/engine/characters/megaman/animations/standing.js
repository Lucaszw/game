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

    async draw(player, showGun=false) {
        let x = player.x;
        let image = this.images[showGun ? "standing-gun" : "standing"];
        let canvas = this.context.canvas;
        let scale = this.getScaleFactor();

        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);
        if (player.xDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= player.x*2 + 100;
        }

        this.context.drawImage(image.image, -10,-10, image.spriteWidth, image.spriteHeight, x, player.y, 100, 100);
        this.context.resetTransform();
    }
}

export default new Standing();