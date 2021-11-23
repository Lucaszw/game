const _ = require('lodash');
const { Server } = require("socket.io");

class SocketService {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: true
            }
        });
        this.io.on('connection', this.onConnection.bind(this));
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
    emitPlayerPositionChanged(player) {
        this.io.emit("player-updated", player);
    }
    onPlayerPositionChanged(player) {
        this.emitPlayerPositionChanged(player);
    }
    onBulletFired(player) {
        this.emitBulletFired(player);
    }
    async onConnection(socket) {
        console.log('a user connected');
        socket.on("disconnect", this.onDisconnect.bind(this));
        socket.on('player-position-changed', this.onPlayerPositionChanged.bind(this));
        socket.on("bullet-fired", this.onBulletFired.bind(this));
        await this.emitPlayerList(socket);
    }
    async onDisconnect(socket) {
        console.log("a user disconnected");
        await this.emitPlayerList(socket);
    }
}

module.exports = (server) => {
    return new SocketService(server);
};