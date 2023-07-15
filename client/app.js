
const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');
const socket = io();

let userName = null;

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('login', ({ name, id }) => login(name, id));
const login = (event) => {
    event.preventDefault();
    if (userNameInput.value === ''){
        alert('Login cannot be empty');
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('login', { name: userName, id: socket.id })
        socket.emit('loginMessage', { author: 'ChatBot', content: `${userName} has joined the chat!`})
    }
};

const sendMessage = (event) => {
    event.preventDefault();
    if (messageContentInput.value === ''){
        alert('Message cannot be empty');
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value })
        messageContentInput.value = '';
    }
};

const addMessage = (author, content) => {
    const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  if(author === 'ChatBot') message.classList.add('message--bot');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}
loginForm.addEventListener('submit', function(event) {
    login(event);
})

addMessageForm.addEventListener('submit', function(event) {
    sendMessage(event);
})