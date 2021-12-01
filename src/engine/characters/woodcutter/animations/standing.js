import WoodcutterAnimation from "../WoodcutterAnimation";

class Standing extends WoodcutterAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/woodcutter/idle.png", 
                name: "standing",
                spriteWidth: 410,
                spriteHeight: 410,
                rows: 1,
                columns: 4
            },
            {
                url: "/woodcutter/attack1.png",
                name: "attack1",
                spriteWidth: 273,
                spriteHeight: 273,
                rows: 1,
                columns: 6
            }
        ]
        this.frameUpdateRate = 4;
    }

    async draw(player) {
        let x = player.x;
        let image = this.images[player.isAttacking ? "attack1" : "standing"];
        let stretchFactor = player.isAttacking ? 20 : 0;

        let canvas = this.context.canvas;
        let scale = this.getScaleFactor();
        let sheet = this.getSheet(image);
        let position = WoodcutterAnimation.spriteCoordinates(sheet.i, sheet.ii, image);

        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);
        if (player.xDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= player.x*2 + 100;
        }

        this.context.drawImage(image.image, position.x, position.y, image.spriteWidth, image.spriteHeight, x+image.offsetX, player.y+image.offsetY-stretchFactor, 100+stretchFactor, 100+stretchFactor);
        this.context.resetTransform();
        this.incrementSheet(image);
    }
}

export default new Standing();