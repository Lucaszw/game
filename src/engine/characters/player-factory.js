import _ from "lodash";

export const playerProperties = {
    x: 0,
    y: 0,
    xDirection: "right",
    yDirection: "down",
    isRunning: false,
    isFallingOrJumping: false,
    isShooting: false,
    isAttacking: false,
    takingDamage: false,
    isGuarding: false,
    shieldHealth: 100,
    hits: 0,
    deaths: 0,
    type: null
}

export class PlayerFactory {
    constructor(socket, playerType) {
        this.socket = socket;
        this.currentPlayerType = playerType;
    }

    createPlayer(id, properties=playerProperties) {
        let factory = this;
        let player;
        let defaults = _.extend({}, properties, {
            fireBullet: (...args) => {
                factory.fireBullet(...[player, ...args]);
            },
            swingWeapon: (...args) => {
                factory.swingWeapon(...[player, ...args]);
            },
            isMyself: this.socket.id == id,
            id: id,
            type: this.currentPlayerType
        });

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
        this.socket.emit("player-updated", player);
    }

    fireBullet(proxy) {
        let player = JSON.parse(JSON.stringify(proxy));
        this.socket.emit("bullet-fired", player);
    }

    swingWeapon(proxy) {
        let player = JSON.parse(JSON.stringify(proxy));
        this.socket.emit("weapon-swung", player);
    }
}

export default PlayerFactory;