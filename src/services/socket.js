import {io} from "socket.io-client";
import _ from "lodash";
import {
    players as playerStore,
} from "../store.js";


class PlayerFactory {
    constructor(socket) {
        this.socket = socket;
    }

    createPlayer(id) {
        let factory = this;
        let player;
        player = new Proxy({
            x: 0,
            y: 0,
            id: id,
            xDirection: "left",
            yDirection: "down",
            isRunning: false,
            isFallingOrJumping: true,
            isShooting: false,
            isMyself: this.socket.id == id,
            fireBullet: (...args) => {
                factory.fireBullet(...[player, ...args]);
            }
        }, {
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

class GameSocket {
    constructor() {
        this.socket = io(`${process.env.HOST}:5002`);
        this.playerFactory = new PlayerFactory(this.socket);

        this.players = [];
        playerStore.subscribe((players) => {
            this.players = players;
        })
        this.socket.on('connect', function (...args) {
            console.log("Connected! ", args, this);
        });
        this.socket.on('player-list-changed', this.playersChanged.bind(this));
        this.socket.on('player-updated', this.playerUpdated.bind(this));
    }

    playerStateChanged(player) {
        playerStore.set(this.players);
    }

    addPlayers(ids) {
        let newPlayers = []
        for (let playerId of ids) {
            const player = this.playerFactory.createPlayer(playerId);
            console.log({player});
            newPlayers.push(player)
        }

        this.players = [...this.players, ...newPlayers];
    }

    removePlayers(ids) {
        _.remove(this.players, (player) => (_.includes(ids, player.id)));
        this.players = [...this.players];
    }

    playersChanged(playerIds) {
        let stalePlayerIds = _.map(this.players, "id");
        let removedPlayerIds = _.filter(stalePlayerIds, (id) => (!_.includes(playerIds, id)));
        let newPlayerIds = _.filter(playerIds, (id) => (!_.includes(stalePlayerIds, id)));

        this.addPlayers(newPlayerIds);
        this.removePlayers(removedPlayerIds);

        playerStore.set(this.players);
    }

    playerUpdated(p) {
        if (p.id == this.socket.id) return;
        const player = _.find(this.players, (_p) => _p.id === p.id);
        player.x = p.x;
        player.y = p.y;
        player.xDirection = p.xDirection;
        player.yDirection = p.yDirection;
        player.isRunning = p.isRunning;
        player.isFallingOrJumping = p.isFallingOrJumping;
        player.isShooting = p.isShooting;
    }

}

export default GameSocket;
