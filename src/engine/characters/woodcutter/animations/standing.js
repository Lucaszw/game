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
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 4,
                offsetY: 0,
                offsetX: 0
            }
        ]
        this.frameUpdateRate = 5;
    }

    async draw(player) {
        let x = player.x;
        let image = this.images["standing"];
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

        this.context.drawImage(image.image, position.x, position.y, image.spriteWidth, image.spriteHeight, x+image.offsetX, player.y+image.offsetY, 100, 100);
        this.context.resetTransform();
        this.incrementSheet(image);
    }
}

export default new Standing();