import WoodcutterAnimation from "../WoodcutterAnimation";
class Jumping extends WoodcutterAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/woodcutter/jumping-up.png", 
                name: "jumping-up",
                spriteWidth: 570,
                spriteHeight: 570,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 4
            },
            {
                url: "/woodcutter/jumping-down.png", 
                name: "jumping-down",
                spriteWidth: 145,
                spriteHeight: 145,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 2
            }
        ];
        this.frameUpdateRate = 1;
    }

    async draw(player, imageName="jumping-up") {
        if (imageName != this.currentImageName) {
            this.resetSheet();
            this.currentImageName = imageName;
        }
        let x = player.x;
        let scale = this.getScaleFactor();

        const image = this.images[imageName];
        let sheet = this.getSheet(image);
        let position = WoodcutterAnimation.spriteCoordinates(sheet.i, sheet.ii, image);

        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);

        if (player.xDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= player.x*2 + 100;
        }

        this.context.drawImage(image.image, position.x,position.y, image.spriteWidth, image.spriteHeight, x, player.y, 100, 100);
        this.context.resetTransform();

        this.ended = this.incrementSheet(image);
        if (this.ended) {
            this.emit('animation:ended', {});
        }
    }
}

export default new Jumping();
