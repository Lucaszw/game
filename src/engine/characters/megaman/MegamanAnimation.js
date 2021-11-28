import _ from "lodash";
import Animation from "src/engine/Animation.js";

class MegamanAnimation extends Animation {
    static vf = 20;
    static name = "megaman";
    constructor() {
        super();
        this.frameProgress = 0;
        this.frameUpdateRate = 0;
    }


    getSheet(image) {
        if (image.rows > this.sheet.i
            && image.columns > this.sheet.ii) return this.sheet;
        
        this.sheet.i = 0;
        this.sheet.ii = 0;
        return this.sheet;
    }

    static characterVelocityX() {
        return 0;
    }

    static getHeight(t) {
        const h = Math.sin(t);
        return t > Math.PI ? 0 : h;
    }

    static getPushback(t) {
        const x = Math.sin(t);
        return t > Math.PI/2 ? 0 : x;
    }
}

export default MegamanAnimation;