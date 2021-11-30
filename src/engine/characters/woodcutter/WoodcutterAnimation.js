import _ from "lodash";
import Animation from "src/engine/Animation.js";

class WoodcutterAnimation extends Animation {
    static vf = 20;
    static name = "woodcutter";
    constructor() {
        super();
        this.frameProgress = 0;
        this.frameUpdateRate = 0;
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

export default WoodcutterAnimation;