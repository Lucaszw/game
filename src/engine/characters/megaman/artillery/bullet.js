import Animation from "src/engine/Animation";

class Bullet extends Animation {
    constructor() {
        super();

        this.imageURLS = [
            {
                url: "/megaman/bullet.png", 
                name: "bullet",
                spriteWidth: 20,
                spriteHeight: 20,
                offsetY: 5
            },
            {
                url: "/megaman/bullet-explode.png",
                name: "bullet-explode",
                spriteWidth: 160,
                spriteHeight: 160,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 3,
                offsetY: -10
            }
        ];
        this.frameProgress = 0;
        this.frameUpdateRate = 3;
    }

    draw(x, y, isExploding=false) {
        const image = this.images[isExploding ? "bullet-explode" : "bullet"];
        const scale = this.getScaleFactor();
        let sheet = this.getSheet(image);
        let position = Animation.spriteCoordinates(sheet.i, sheet.ii, image);

        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);
        this.context.drawImage(
            image.image, 
            position.x,
            position.y, 
            image.spriteWidth,
            image.spriteHeight,
            x+image.offsetX,
            y+image.offsetY,
            50,
            50
        );
        this.context.resetTransform();
        const ended = this.incrementSheet(image);
        if (ended && isExploding) {
            this.emit('animation:ended', {});
        }
    }
}

export default Bullet;