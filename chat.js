
const socket = io();

const message = document.querySelector('.input-box');
const sendBtn = document.querySelector('#btn-send');
const content = document.querySelector('.content');

sendBtn.addEventListener('click', () => {
    e.preventDefault();
    socket.emit('message', message.value);
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

socket.on('message', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    content.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
})

//스크롤 아래 고정
function scrollToBottom(content){
    content.scrollTop = content.scrollHeight;
}
/*
* on 해서 함수명 설정, 어떤 함수인지 작성하고 사용할 곳에서 emit()하면 되는듯.
* */