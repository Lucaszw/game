import {io} from "socket.io-client";
import _ from "lodash";

import { writable, derived } from 'svelte/store';

export const socket = writable();
export const players = writable([]);
export const bot = writable();

import {PlayerFactory, playerProperties} from "src/engine/characters/player-factory.js"
import {BotFactory, botProperties} from "src/engine/ai/bot-factory.js";

class GameSocket {
    constructor() {}

    initialize(playerType) {
        this.socket = io(`${process.env.HOST}:5002`);
        this.playerFactory = new PlayerFactory(this.socket, playerType);
        this.botFactory = new BotFactory(this.socket, playerType);

        this.players = [];
        this.bot = null;

        players.subscribe((_players) => {
            this.players = [..._players];
        })

        bot.subscribe((_bot) => {
            this.bot = _bot;
        })

        this.socket.on('connect', function (...args) {
            console.log("Connected! ", args, this);
        });
        this.socket.on('player-list-changed', this.playersChanged.bind(this));
        this.socket.on('player-updated', this.playerUpdated.bind(this));
        this.socket.on('create-bot', this.createBot.bind(this));
        this.socket.on("bot-destroyed", this.removeBot.bind(this));
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

    botUpdated(b) {
        if (b.id == this.socket.id) return bot.set(this.bot);

        if (!this.bot) this.bot = this.botFactory.createBot(b.id);
        const keys = _.keys(botProperties);
        for (let key of keys) {
            this.bot[key] = b[key];
        }

        return bot.set(this.bot);
    }

    playerUpdated(p) {
        if (p.isBot) return this.botUpdated(p);

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

    createBot(defaults) {
        this.bot = this.botFactory.createBot(this.socket.id);
        bot.set(this.bot);
    }

    removeBot() {
        this.bot = null;
        bot.set(this.bot);
    }
}

export default new GameSocket();
