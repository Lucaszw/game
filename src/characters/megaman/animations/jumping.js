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

    async draw(characterPosition, characterDirection, showGun=false) {
        let x = characterPosition.x;
        let imageName;
        if (characterDirection.y == "up" && showGun) {
            imageName = "jumping-up-gun";
        }
        if (characterDirection.y == "up" && !showGun) {
            imageName = "jumping";
        }
        if (characterDirection.y == "down" && showGun) {
            imageName = "jumping-down-gun";
        }
        if (characterDirection.y == "down" && !showGun) {
            imageName = "jumping-down";
        }
        const image = this.images[imageName];

        if (characterDirection.x == "left") {
            // Invert image to appear walking left
            // context.translate(characterPosition.x+150, 0);
            this.context.scale(-1, 1);
            x -= characterPosition.x*2 + 100;
        }

        this.context.drawImage(image.image, -10,-10, image.spriteWidth, image.spriteHeight, x, characterPosition.y, 100, 100);
        this.context.resetTransform();
    }
}

export default new Jumping();
