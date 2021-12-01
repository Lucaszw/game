import WoodcutterAnimation from '../WoodcutterAnimation';


class Hit extends WoodcutterAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/woodcutter/hit.png", 
                name: "hit",
                spriteWidth: 102,
                spriteHeight: 102,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 3 
            }
        ]
        this.frameProgress = 0;
        this.frameUpdateRate = 2;
    }

    async draw(player) {
        let x = player.x;
        let y = player.y;
        let image = this.images["hit"];
        let sheet = this.getSheet(image);
        let position = WoodcutterAnimation.spriteCoordinates(sheet.i, sheet.ii, image);
        // let canvas = this.context.canvas;
        let scale = this.getScaleFactor();
        this.context.resetTransform();
        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);

        if (player.xDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x + 100, 0);
            this.context.scale(-1, 1);
            x -= x*2 + 100;
        }

        this.context.drawImage(
            image.image, 
            position.x,
            position.y, 
            image.spriteWidth,
            image.spriteHeight,
            x+image.offsetX,
            y+image.offsetY,
            100,
            100
        );
        this.context.resetTransform();
            
        const ended = this.incrementSheet(image);
        if (ended) {
            this.emit('animation:ended', {});
        }
    }
}

export default new Hit();