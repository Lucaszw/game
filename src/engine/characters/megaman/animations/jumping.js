import MegamanAnimation from "../MegamanAnimation";
class Jumping extends MegamanAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/megaman/jumping.png", 
                name: "jumping",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 1 
            },
            {
                url: "/megaman/jumping-down.png", 
                name: "jumping-down",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 1 
            },
            {
                url: "/megaman/jumping-up-gun.png", 
                name: "jumping-up-gun",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 1 
            },
            {
                url: "/megaman/jumping-down-gun.png", 
                name: "jumping-down-gun",
                spriteWidth: 46,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 1,
                columns: 1 
            }
        ];
    }

    async draw(player, showGun=false) {
        let x = player.x;
        let imageName;
        let scale = this.getScaleFactor();

        if (player.yDirection == "up" && showGun) {
            imageName = "jumping-up-gun";
        }
        if (player.yDirection == "up" && !showGun) {
            imageName = "jumping";
        }
        if (player.yDirection == "down" && showGun) {
            imageName = "jumping-down-gun";
        }
        if (player.yDirection == "down" && !showGun) {
            imageName = "jumping-down";
        }
        const image = this.images[imageName];
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

export default new Jumping();
