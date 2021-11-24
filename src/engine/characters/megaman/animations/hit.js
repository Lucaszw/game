import MegamanAnimation from '../MegamanAnimation';


class Hit extends MegamanAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/megaman/hit.png", 
                name: "hit",
                spriteWidth: 370,
                spriteHeight: 370,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 3 
            }
        ]
        this.frameProgress = 0;
        this.frameUpdateRate = 2;
    }

    async draw(player, showGun=false) {
        let x = player.x;
        let y = player.y;
        let image = this.images["hit"];
        let sheet = this.getSheet(image);
        let position = MegamanAnimation.spriteCoordinates(sheet.i, sheet.ii, image);
        // let canvas = this.context.canvas;
        let scale = this.getScaleFactor();

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
            
        let ended = false;
        if (this.frameProgress == this.frameUpdateRate) {
            ended = this.incrementSheet(image);
            this.frameProgress = 0;
        } else {
            this.frameProgress += 1;
        }

        if (ended) {
            this.emit('animation:ended', {});
        }
    }
}

export default new Hit();