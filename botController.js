class Bot {
    constructor(id) {
        this.id = id;
    }
    toJSON() {
        // return JSON.parse(JSON.stringify(this));
        return {id: this.id};
    }
}

class BotController {
    constructor(io) {
        this.io = io;
        this.bot = null;
    }

    createBot(socket) {
        // Create bot, and make the socket provided responsible for it
        if (this.bot) return;
        this.bot = new Bot(socket.id);
        socket.emit("create-bot", this.bot.toJSON());
    }

    removeBot() {
        this.io.emit("bot-destroyed", this.bot.toJSON());
        this.bot = null;
    }
}

module.exports = BotController;