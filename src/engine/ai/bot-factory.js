import _ from "lodash";

import {playerProperties, PlayerFactory} from "../characters/player-factory";

export const botProperties = _.extend({
    isBot: true,
    width: 100,
    height: 100
}, playerProperties);

export class BotFactory extends PlayerFactory {
    constructor(socket, playerType) {
        super(socket, playerType);
        // this.socket = socket;
        // this.currentPlayerType = playerType;
    }
    createBot(id) {
        // console.log("create bot...")
        return this.createPlayer('b'+id, botProperties);
    }
}

export default PlayerFactory;