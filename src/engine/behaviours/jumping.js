import LogScale from "log-scale"

export default class JumpingBehaviour {
    vy = 0;
    vg = 20;
    constructor(player) {
        this.player = player;
        this.logScaleY = new LogScale(10, 20);
    }

    dyUp(frame) {
        return -this.logScaleY.linearToLogarithmic(this.logScaleY.maxValue - frame/10)
    }

    dyDown(frame) {
        return this.logScaleY.linearToLogarithmic(frame/10)
    }

    jump(peakHeight=0, frame=0, isJumping=true) {
        const V = isJumping ? this.dyUp(frame) : this.dyDown(frame);
        this.player.yDirection = isJumping ? "up" : "down";
        this.vy = (this.player.isFallingOrJumping || frame == 0) ? V : 0;
        frame ++;

        if (isJumping) {
            isJumping = (this.player.y - this.vy <= peakHeight) ? false : true;
        }

        if (this.vy != 0) return setTimeout(this.jump.bind(this, peakHeight, frame, isJumping), 100);
    }
}