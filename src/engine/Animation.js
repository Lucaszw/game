import _ from "lodash";

class Animation {
    static name = "animation";
    constructor() {
        this.images = [];
        this.sheet = {
            i: 0,
            ii: 0
        };
    }

    async load(context) {
        this.context = context;
        if (_.keys(this.images).length) return this.images;
        
        const defaults = {
            spriteWidth: 41,
            spriteHeight: 41,
            borderWidth: 0,
            spacingWidth: 0,
            offsetX: 0,
            offsetY: 0,
            rows: 1,
            columns: 1
        };

        let promises = this.imageURLS.map((imageInfo) => (new Promise((res, rej) => {
            imageInfo = _.extend(_.clone(defaults), imageInfo);
            const image = new Image();
            const imageURL = imageInfo.url;
            image.src = imageURL;
            image.onload = drawImage;
            function drawImage() {
                res (_.extend({image}, imageInfo));
            }
        })));

        this.images = _.keyBy(await Promise.all(promises), "name");
        return this.images;
    }


    incrementSheet(image) {
        const {rows, columns} = image;
        
        if (this.sheet.i >= rows-1 && this.sheet.ii >= columns-1) {
            // End of sheet
            this.sheet.i = 0;
            this.sheet.ii = 0;
        } else if (this.sheet.ii >= columns-1) {
            // End of row
            this.sheet.i += 1;
            this.sheet.ii = 0;
        } else {
            // End of column
            this.sheet.ii += 1;
        }
    }

    getSheet(image) {
        if (image.rows > this.sheet.i
            && image.columns > this.sheet.ii) return this.sheet;
        
        this.sheet.i = 0;
        this.sheet.ii = 0;
        return this.sheet;
    }

    static spriteCoordinates(row, col, sprite) {
        // https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
        const borderWidth = sprite.borderWidth || 0;
        const spriteWidth = sprite.spriteWidth || 0;
        const spriteHeight = sprite.spriteHeight || 0;
        const spacingWidth = sprite.spacingWidth || 0;
        return {
            x: (
                borderWidth +
                col * (spacingWidth + spriteWidth)
            ),
            y: (
                borderWidth +
                row * (spacingWidth + spriteHeight)
            )
        }
    }

    static checkCollision(colliders, player) {
        let hitByCollider = (collider) => {
            if (collider.name != "bullet") return false;
            if (collider.ownerId == player.id) return false;
            if (collider.x2 >= player.x && collider.x1  <= player.x+100 ) return true;
            return false;
        }
        let isInCollider = (collider) => {
            if (collider.name == this.name) return false;
            // console.log(collider.name, this.name)
            if (collider.x1 > player.x+50) return false;
            if (collider.x2 < player.x+50) return false;
            if (collider.y1 > player.y+100) return false;
            if (collider.y2 < player.y) return false;
            return true;
        }
        for (let collider of colliders) {
            // console.log("name: "+collider.name)
            if (!hitByCollider(collider)) continue;
            return {hit: true, region: "side", type: "bullet"}
        }
        for (let collider of colliders) {
            if (!isInCollider(collider)) continue;
            let characterBottom = player.y+100;
            let characterMidpoint = player.y+80;
            let characterTop = player.y;

            if (collider.y1 <= characterBottom && collider.y1 > characterMidpoint) return {hit: true, region: "top", y: collider.y1 - 100};
            if (collider.y2 >= characterTop && collider.y2 < characterBottom ) return {hit: true, region: "bottom", y: collider.y2};
        }
        return {hit: false};
    }
    
    static characterVelocityX(...args) {
        return 0;
    }

    static characterVelocityY(...args) {
        return 0;
    }

}

export default Animation;