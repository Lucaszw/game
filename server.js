const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const _ = require('lodash');
const {wrap, errorHandler} = require('./router/utils');
const cors = require('cors')
const socketService = require('./socket')(server);

app.use(cors())


app.get('/', wrap ((req, res) => {
    return 1
}));

app.get('/users', wrap (async (rew, res) => {
    return await socketService.getUserIds();
}));

app.use(errorHandler);

server.listen(5002, () => {
  console.log('listening on *:5002');
});

