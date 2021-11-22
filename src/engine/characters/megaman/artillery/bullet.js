import Animation from "src/engine/Animation";

class Bullet extends Animation {
    constructor() {
        super();

        this.imageURLS = [
            {url: "/megaman/bullet.png", name: "bullet"}
        ]; 
    }

    draw(x, y) {
        const image = this.images["bullet"];
        this.context.drawImage(
            image.image, 
            0,
            0, 
            image.spriteWidth,
            image.spriteHeight,
            x+image.offsetX,
            y+image.offsetY,
            100,
            100
        );
        this.context.resetTransform();
    }
}

export default new Bullet();