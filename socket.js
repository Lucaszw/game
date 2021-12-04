const _ = require('lodash');
const { Server } = require("socket.io");
const BotController = require('./botController');
class SocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: true
            }
        });
        this.io.on('connection', this.onConnection.bind(this));
        this.botController = new BotController(this.io);
    }
    async getUserIds() {
        return _.map(await this.io.fetchSockets(), "id");
    }
    async emitPlayerList(socket) {
        this.io.emit("player-list-changed", await this.getUserIds());
    }
    emitBulletFired(player) {
        this.io.emit("bullet-fired", player);
    }
    emitWeaponSwung(player) {
        this.io.emit("weapon-swung", player);
    }
    emitPlayerUpdated(player) {
        this.io.emit("player-updated", player);
    }
    onPlayerUpdated(player) {
        this.emitPlayerUpdated(player);
    }
    onBulletFired(player) {
        this.emitBulletFired(player);
    }
    onWeaponSwung(player) {
        this.emitWeaponSwung(player);
    }
    async onConnection(socket) {
        console.log('a user connected');
        socket.on("disconnect", this.onDisconnect.bind(this, socket));
        socket.on('player-updated', this.onPlayerUpdated.bind(this));
        socket.on('weapon-swung', this.onWeaponSwung.bind(this));
        socket.on("bullet-fired", this.onBulletFired.bind(this));
        await this.emitPlayerList(socket);

        if (!this.botController.bot) {
            this.botController.createBot(socket);
        }
    }
    async onDisconnect(socket) {
        console.log("user disconnected", socket.id);

        if (socket.id == this.botController.bot.id) {
            this.botController.removeBot(socket)
        }
        await this.emitPlayerList(socket);
    }
}

module.exports = (server) => {
    return new SocketService(server);
};