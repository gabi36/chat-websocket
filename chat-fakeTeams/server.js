const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const Datastore = require('nedb');

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Teacher';

// run when participants connects
io.on('connection', socket => {
    socket.on('addToDatabase', (usernameRegister) => {
        database.insert({username:usernameRegister});
    })

    socket.on('deleteFromDatabase', (usernameRegister) => {
        database.remove({username:usernameRegister});
    })

    socket.on('updateDatabase', ({old_username, new_username}) => {
        database.update({ username: old_username }, { username: new_username});
    })

    socket.on('joinRoom', ({username, room}) => {

        database.findOne({username: username}, function (err, doc) {
            if (doc != null) {
                const user = userJoin(socket.id, username, room);

                socket.join(user.room);

                // welcome participant
                socket.emit('message', formatMessage(botName, ` Welcome to the ${room} course!`));

                // broadcast when user connects
                socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

                // send user and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                })
            } else {
                const user = userJoin(socket.id, username, "Empty room");

                socket.join(user.room);

                // welcome participant
                socket.emit('message', formatMessage(botName, ` Welcome to the empty room`));

                // broadcast when user connects
                socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

                // send user and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                })
            }
        });


    });


    // run when participant disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // send user and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });

    //listen from chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('message', formatMessage(user.username, msg));
        socket.emit('messageSend', formatMessage(user.username, msg));
    });


});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const database = new Datastore('database.db');
database.loadDatabase(function (error) {
    if (error) {
        console.log('FATAL: local database could not be loaded. Caused by: ' + error);
        throw error;
    }
    console.log('INFO: local database loaded successfully.');
});

/*database.insert({username: 'Alex'});
database.insert({username: 'Gabi'});*/

