import _ from "lodash";

export const playerProperties = {
    x: 0,
    y: 0,
    xDirection: "left",
    yDirection: "down",
    isRunning: false,
    isFallingOrJumping: false,
    isShooting: false,
    takingDamage: false,
    isGuarding: false,
    shieldHealth: 100,
    hits: 0
}

export class PlayerFactory {
    constructor(socket) {
        this.socket = socket;
    }

    createPlayer(id) {
        let factory = this;
        let player;
        let defaults = _.extend({
            fireBullet: (...args) => {
                factory.fireBullet(...[player, ...args]);
            },
            isMyself: this.socket.id == id,
            id: id
        }, playerProperties);

        player = new Proxy(defaults, {
            get: function (target, key) {
                return target[key];
            },
            set: function(target, key, val) {
                target[key] = val;
                if (target["id"] == factory.socket.id) {
                    factory.emitPlayerUpdated(player);
                }
                return true;
            }
        });

        return player;
    }

    emitPlayerUpdated(proxy) {
        let player = JSON.parse(JSON.stringify(proxy));
        this.socket.emit("player-position-changed", player);
    }

    fireBullet(proxy) {
        let player = JSON.parse(JSON.stringify(proxy));
        this.socket.emit("bullet-fired", player);
    }
}

export default PlayerFactory;