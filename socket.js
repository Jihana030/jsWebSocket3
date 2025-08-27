const express = require('express');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {Server} = require('socket.io');

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
    socket.on('chat message', (username, msg, side, state) => {
        io.emit('chat message', username, msg, side, state);
        socket.name = username;
        console.log(io.sockets.server.eio.clientsCount);
    })
})

server.listen(3000, ()=>{
    console.log('server listening on port 3000')
})
