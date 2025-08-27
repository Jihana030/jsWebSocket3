// import {io} from "socket.io-client";
// const {io} = require('socket.io-client');
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io();

const message = document.querySelector('.input-box');
const sendBtn = document.querySelector('#btn-send');
const content = document.querySelector('.content');

let participants;
let disConnectUser = false;
//참가자명단 상단에 표시
const userList = document.querySelector('.user-name');
const userRate = document.querySelector('.user-id');
function displayList(name){
    console.log(name)
    userList.textContent = name.join();
    userRate.textContent = `${name.length}명`;
}

let userName;
const chatThumb = document.querySelector('.user-thumb img')
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    userName = urlParams.get('username');
    chatThumb.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${userName}`;
    socket.emit('chat message', '[system]', `${userName}님이 입장하셨습니다.`, 'me', 'state');
})

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('chat message', userName, message.value, 'me', 'state');
    message.value = '';
    message.style.height = 'auto';
})
// enter event
message.addEventListener("keydown", (e)=>{
    if(e.key === 'Enter'){
        if(!e.shiftKey){
            e.preventDefault();
            sendBtn.click();
        }
    }
});

// 메시지함수 정의
socket.on('chat message', (userName, msg, side, state, userList) => {
    participants = userList;
    displayList(participants);
    messageForm(userName, msg, side, state);
})

function messageForm(name, msg, side, state) {
    const time = new Date().toLocaleString();
    let user = `
        <div class="user-thumb">
            <img src="https://api.dicebear.com/9.x/thumbs/svg?seed=${name}" alt="user">
            <span class="user-name">${name}</span>
        </div>
    `;
    let temp = `
        <div class="user-message">
            <div>
                ${msg.replaceAll(/(\n|\r\n)/g, "<br>")}
                <span>${time}</span>
            </div>
        </div>
    `;
    let temp2 = `
        <div>
            ${msg.replaceAll(/(\n|\r\n)/g, "<br>")}
            <span>${time}</span>
        </div>
    `

    if(side === 'me'){
        if(content.children.length === 0){
            const chatMe = document.createElement('div');
            chatMe.className = 'chat-bubble right';
            chatMe.innerHTML = temp;
            content.appendChild(chatMe);
        } else if(content.lastElementChild.classList.contains('right')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            userMessage.innerHTML += temp2;
        } else {
            const chatMe = document.createElement('div')
            chatMe.className = 'chat-bubble right';
            chatMe.innerHTML = temp;
            content.appendChild(chatMe);
        }
    } else {
        if(content.children.length === 0){
            const chatMe = document.createElement('div');
            chatMe.className = 'chat-bubble left';
            chatMe.innerHTML = user;
            chatMe.innerHTML += temp;
            content.appendChild(chatMe);
        } else if(content.lastElementChild.classList.contains('left')){
            const userMessage = content.lastElementChild.querySelector('.user-message');
            const userThumb = content.lastElementChild.querySelector('.user-thumb');
            if(name !== userThumb.querySelector('.user-name').innerText){
                const chatMe = document.createElement('div')
                chatMe.className = 'chat-bubble left';
                chatMe.innerHTML += user;
                chatMe.innerHTML += temp;
                content.appendChild(chatMe);
            } else {
                userMessage.innerHTML += temp2;
            }
        } else {
            const chatMe = document.createElement('div')
            chatMe.className = 'chat-bubble left';
            chatMe.innerHTML += user;
            chatMe.innerHTML += temp;
            content.appendChild(chatMe);
        }
    }

    scrollToBottom(content)
}

//스크롤 아래 고정
function scrollToBottom(content){
    content.scrollTop = content.scrollHeight;
}
/*
* on 해서 함수명 설정, 어떤 함수인지 작성하고 사용할 곳에서 emit()하면 되는듯.
* */