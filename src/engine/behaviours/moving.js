import LogScale from "log-scale"

export default class MovingBehaviour {
    player = null;
    beingPushed = false;
    vx = 0;
    constructor(player) {
        this.player = player;
        this.logScaleX = new LogScale(0,4);
    }

    dyStart(frame) {
        return this.logScaleX.linearToLogarithmic(this.logScaleX.maxValue - frame/10)
    }

    dyEnd(frame) {
        return this.logScaleX.linearToLogarithmic(frame/10)
    }
    
    push(attackRegion) {
        if (this.beingPushed) return;

        this.beingPushed = true;
        let interval;
        let frame = 0;
        let reachedMaxHitVelocity = false;

        const stop = () => {
            this.beingPushed = false;
            clearInterval(interval);
            this.vx = 0;
        }

        interval = setInterval(() => {
            const V = reachedMaxHitVelocity ? this.dyStart(frame) : this.dyEnd(this.player.hits - frame);
            if (V >= this.logScaleX.maxValue) reachedMaxHitVelocity = true;

            frame ++;
            let dv = V;
            dv *= (attackRegion == "left") ? -1 : 1;
            this.vx += dv;

            if (V == 0) stop();
        }, 1);
    }
}