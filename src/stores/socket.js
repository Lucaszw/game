import {io} from "socket.io-client";
import _ from "lodash";

import { writable, derived } from 'svelte/store';

export const socket = writable();
export const players = writable([]);

import {PlayerFactory, playerProperties} from "../engine/characters/player-factory.js"

class GameSocket {
    constructor() {}

    initialize(playerType) {
        this.socket = io(`${process.env.HOST}:5002`);
        this.playerFactory = new PlayerFactory(this.socket, playerType);

        this.players = [];
        players.subscribe((_players) => {
            this.players = [..._players];
        })

        this.socket.on('connect', function (...args) {
            console.log("Connected! ", args, this);
        });
        this.socket.on('player-list-changed', this.playersChanged.bind(this));
        this.socket.on('player-updated', this.playerUpdated.bind(this));

        socket.set(this.socket);
    }

    addPlayers(ids) {
        let newPlayers = []
        for (let playerId of ids) {
            const player = this.playerFactory.createPlayer(playerId);
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

        players.set(this.players);
    }

    playerUpdated(p) {
        if (p.id == this.socket.id) {
            // If the updated player is us, then only trigger a store update
            // (single source of truth)
            return players.set(this.players);
        }
        const player = _.find(this.players, (_p) => _p.id === p.id);
        const keys = _.keys(playerProperties);
        for (let key of keys) {
            player[key] = p[key];
        }
        return players.set(this.players);
    }

}

export default new GameSocket();
