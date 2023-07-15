const express = require('express');
const db = require('./db');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);
io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('login', (login) => {
        console.log('login: ', login);
        db.users.push(login);
        console.log('db: ', db.users);
        
    })
    socket.on('message', (message) => { 
        console.log('Oh, I\'ve got something from ' + socket.id) 
        db.messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => { 
        for(let user of db.users) {
            if(user.id === socket.id) {
                const index = db.users.indexOf(user);
                socket.broadcast.emit('message', { author: 'ChatBot', content: `${db.users[index].name} has left the chat... :(`});
                db.users.splice(index, 1);
            }
        }  
        console.log('db: ', db.users);
        console.log('Oh, socket ' + socket.id + ' has left') 
    });
    socket.on('loginMessage', (loginMessage) => {
        socket.broadcast.emit('message', loginMessage);
    })
    console.log('I\'ve added a listener on message event \n');
  });