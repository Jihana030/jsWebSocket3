const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');
const {use} = require("express/lib/application");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection', (socket) => {
    let userList = [];
    socket.on('chat message', (username, msg, side, state) => {
        socket.name = username;
        // userList = io.sockets.server.eio.clientsCount;
        userList.push(socket.name);
        io.emit('chat message', username, msg, side, state, userList);
    })
    socket.on('disconnect',(username, msg, side, state) => {
        socket.name = username;

        io.emit('chat message', username, msg, side, state);
    })
})

server.listen(3000, ()=>{
    console.log('server listening on port 3000')
})
