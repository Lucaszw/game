import MegamanAnimation from '../MegamanAnimation';

class Running extends MegamanAnimation {
    constructor() {
        super();
        this.imageURLS = [
            {
                url: "/megaman/running.png", 
                name: "running",
                spriteWidth: 110,
                spriteHeight: 116,
                borderWidth: 0,
                spacingWidth: 0,
                rows: 2,
                columns: 5 
            },
            {
                url: "/megaman/running-gun.png", 
                name: "running-gun",
                spriteWidth: 41,
                spriteHeight: 46,
                borderWidth: 0,
                spacingWidth: 0,
                offsetX: 0,
                offsetY: 18,
                rows: 1,
                columns: 10
            }
        ]
    }

    async draw(characterPosition, characterDirection, showGun=false) {        
        let x = characterPosition.x;
        let y = characterPosition.y;
        let image = this.images[showGun ? "running-gun" : "running"];
        let sheet = this.getSheet(image);
        let position = MegamanAnimation.spriteCoordinates(sheet.i, sheet.ii, image);
        if (characterDirection == "left") {
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
        this.incrementSheet(image);
    }
}

export default new Running();