import _ from "lodash";
import EE from "eventemitter3";

const PIXELS_X = 1000;
const PIXELS_Y = 1000;

class Animation extends EE {
    static name = "animation";
    static pixelsX = PIXELS_X;
    static pixelsY = PIXELS_Y;
    constructor() {
        super();
        this.images = [];
        this.sheet = {
            i: 0,
            ii: 0
        };
        this.pixelsX = PIXELS_X;
        this.pixelsY = PIXELS_Y;
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
        if (this.ended) {
            this.sheet.i = rows-1;
            this.sheet.ii = columns-1;
            return true;
        }

        let ended = false;
        
        if (this.frameProgress != this.frameUpdateRate) {
            this.frameProgress += 1;
            return ended;
        }

        this.frameProgress = 0;

        if (this.sheet.i >= rows-1 && this.sheet.ii >= columns-1) {
            // End of sheet
            this.sheet.i = 0;
            this.sheet.ii = 0;
            ended = true;
        } else if (this.sheet.ii >= columns-1) {
            // End of row
            this.sheet.i += 1;
            this.sheet.ii = 0;
        } else {
            // End of column
            this.sheet.ii += 1;
        }
        return ended;
    }
    resetSheet() {
        this.ended = false;
        this.sheet.i = 0;
        this.sheet.ii = 0;
    }
    
    getSheet(image) {
        if (this.ended) {
            this.sheet.i = image.rows-1;
            this.sheet.ii = image.columns-1;
            return this.sheet;
        }

        if (image.rows > this.sheet.i
            && image.columns > this.sheet.ii) return this.sheet;
        
        this.sheet.i = 0;
        this.sheet.ii = 0;
        return this.sheet;
    }

    getScaleFactor(context) {
        context = context || this.context;
        const width  = context.canvas.width;
        const height = context.canvas.height;        
        return _.min([width, height]);
    }

    static getScaleFactor(context) {
        const width  = context.canvas.width;
        const height = context.canvas.height;      
        return _.min([width, height]);
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
                row * (spriteHeight)
            )
        }
    }

    static checkCollisions(colliders, obj) {
        let collisions = [];
        let hitByCollider = (collider) => {
            const isSelf = (collider.id == obj.id);
            const isPlatform = (!collider.name || collider.category == "platform");
            const isOwner = ((collider.id == obj.ownerId) && obj.ownerId);
            const isChild = ((collider.ownerId == obj.id) && collider.ownerId);
            const isSibling = ((collider.ownerId == obj.ownerId) && collider.ownerId);
            const areBothPlayers = ((collider.category == "player") && (obj.category == "player"));
            if (areBothPlayers) return false;
            if (isSelf) return false;
            if (isPlatform) return false;
            if (isOwner || isChild || isSibling) return false;

            if ( collider.x2 >= obj.x1 && collider.x1 <= obj.x2 
                && collider.y2 >= obj.y1 && collider.y1 <= obj.y2) return true;
            return false;
        }
        let isInCollider = (collider) => {
            const areBothPlayers = ((collider.category == "player") && (obj.category == "player"));
            if (areBothPlayers) return false;
            if (collider.name == obj.name) return false;
            if ((collider.id == obj.ownerId) && obj.ownerId) return false;
            if (collider.x1 >= obj.x1+obj.width) return false;
            if (collider.x2 <= obj.x1) return false;
            if (collider.y1 > obj.y2) return false;
            if (collider.y2 < obj.y1) return false;
            return true;
        }
        for (let collider of colliders) {
            if (!collider.direction) continue;
            if (!hitByCollider(collider)) continue;

            collisions.push({
                id: collider.id,
                hit: true,
                region: collider.direction,
                name: collider.name,
                category: collider.category,
                collider
            });
        }
        for (let collider of colliders) {
            if (!isInCollider(collider)) continue;
            let characterBottom = obj.y2;
            let characterMidpoint = obj.y2*0.8;
            let characterTop = obj.y1;

            if (collider.y1 <= characterBottom && collider.y1 > characterMidpoint) collisions.push({
                id: collider.id, 
                hit: true, 
                region: "top", 
                y: collider.y1 - obj.height,
                category: collider.category,
                collider
            });
            if (collider.y2 >= characterTop && collider.y2 < characterBottom ) collisions.push({
                id: collider.id, 
                hit: true, 
                region: "bottom", 
                y: collider.y2,
                category: collider.category,
                collider
            }) ;
        }
        return collisions;
    }
    
    static getHeight(...args) {
        return 0;
    }

    static getPushback(...args) {
        return 0;
    }

}

export default Animation;