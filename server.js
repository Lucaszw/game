const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const _ = require('lodash');
const {wrap} = require('./router/utils');

app.get('/', wrap ((req, res) => {
    return 1
}));

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(function(error, req, res, next) {
    if(res.headersSent) return;

    res.status(500);
    res.setHeader('Content-Type', 'application/json');

    if (!error.type && !error.errors && !error.message) {
        error = {name: "SimpleError", errors: [{message: error}]};
    } else if (!error.type && !error.errors) {
        error = {name: "GenericError", errors: [{message: error.message}]};
    }

    _.forEach(_.get(error, "errors"), (err) => {
        console.error(_.get(err, "message"));
    });

    res.json(error);
});

server.listen(5001, () => {
  console.log('listening on *:5001');
});

