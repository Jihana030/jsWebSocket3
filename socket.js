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
    console.log('user connected');
    socket.on('chat message', (msg)=>{
        console.log(msg);
        io.emit('chat message', msg);
    })
    // socket.broadcast.emit('hi');
})

server.listen(3000, ()=>{
    console.log('server listening on port 3000')
})
