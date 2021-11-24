import Animation from "src/engine/Animation";

class Shield extends Animation {

    constructor() {
        super();
        this.imageURLS = [];
    }
    
    draw(player) {
        let scale = this.getScaleFactor();
        let x = player.x;
        this.context.resetTransform();
        this.context.scale(scale/this.pixelsX, scale/this.pixelsY);
        if (player.xDirection == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x + 100, 0);
            this.context.scale(-1, 1);
            x -= x*2 + 100;
        }

        this.context.beginPath();
        this.context.arc(x+60, player.y+60, 50, 0, 2 * Math.PI, false);
        this.context.fillStyle = `rgba(122, 122, 255, ${player.shieldHealth/500})`;
        this.context.fill();
        this.context.resetTransform();
    }
}

export default new Shield();