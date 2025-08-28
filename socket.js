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

let userList = [];
io.on('connection', (socket) => {
    socket.on('join', (username, msg, side, state)=>{
        socket.name = username;

        //중복 체크
        if(!userList.includes(username)){
            userList.push(socket.name);
            io.emit('join', username, msg, side, state, userList);
        } else {
            //중복의 경우
            socket.isForcedDisconnect = true;
            socket.emit('error', '유효하지 않은 닉네임입니다.');
        }
    })
    socket.on('chat message', (username, msg, side, state) => {
        socket.emit('chat message', username, msg, 'me', state);
        socket.broadcast.emit('chat message', username, msg, 'other', state);
    })

    // 연결이 끊기면 자동 발생
    socket.on('disconnect',() => {
        if(socket.isForcedDisconnect){
            return;
        }
        const disconnectUser = socket.name;
        if(disconnectUser) {
            userList = userList.filter(user=> user !== disconnectUser);
            io.emit('disconnect message', disconnectUser, `${disconnectUser}님이 퇴장하셨습니다.`, 'side', 'state', userList);
        }
    })
})

server.listen(3000, ()=>{
    console.log('server listening on port 3000')
})
