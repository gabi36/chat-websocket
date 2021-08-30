const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();


socket.emit('joinRoom', {username, room}); //join chatroom

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight; //scroll down
});

socket.on('messageSend', message =>{
    console.log(message);
    outputMessage1(message);

    chatMessages.scrollTop = chatMessages.scrollHeight; //scroll down
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msgBox = document.querySelector('.emojionearea-editor');
    const msg = e.target.elements.msg.value; //get message text

    socket.emit('chatMessage', msg); //emit message to Server

    msgBox.innerHTML = "";
});

// output message received
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>  ${message.time}</span></p>
                     <p class="text">${message.text}
               		</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// output message send
function outputMessage1(message){
    const div = document.createElement('div')
    div.classList.add('messageSend');
    div.innerHTML = `<p class="meta">${message.username}<span>  ${message.time}</span></p>
                     <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room to dom
function outputRoomName(room){
    roomName.innerText = room;
}

// add user to dom
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

//Prompt the user before leave chat room
document.querySelector('.btnChatLeave').addEventListener('click', (e) => {
    e.preventDefault();
  if (confirm('Are you sure you want to leave the team?') === true){
    window.location = '../index.html';
     }
});

const listener = document.getElementById('register-form');



listener.addEventListener('submit', (e) => {
    e.preventDefault();

    let newUser = e.target.elements.username_register.value;
    usernameRegister = newUser.trim();

    if(!usernameRegister)
        return false;

    socket.emit('addToDatabase', usernameRegister);
    confirm(usernameRegister);
});

