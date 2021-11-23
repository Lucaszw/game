import {io} from "socket.io-client";
import _ from "lodash";
import {
    socket as socketStore,
    players as playerStore,
} from "../store.js";


class Player {
    constructor(id, isMyself=false) {
        this.id = id;
        this.isMyself = isMyself;
    }
}

class GameSocket {
    constructor() {
        this.socket = io("ws://localhost:5001");
        this.players = [];
        socketStore.set(this.socket);
        playerStore.subscribe((players) => {
            this.players = players;
        })
        this.socket.on('connect', function (...args) {
            console.log("Connected! ", args, this);
        });
        this.socket.on('player-list-changed', this.playersChanged.bind(this));
    }

    addPlayers(ids) {
        for (let playerId of ids) {
            const player = new Player(playerId, playerId == this.socket.id);
            this.players = [...this.players, player];
        }
    }

    removePlayers(ids) {
        _.remove(this.players, (player) => {
            return _.includes(ids, player.id);
        });
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
}

export default GameSocket;
