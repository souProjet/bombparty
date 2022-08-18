const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getNbrUser } = require('./users.js')

const port = 5000;

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', 'Bienvenu dans le jeu !');

        socket.broadcast.to(user.room).emit('message', user.username + ' vient de rejoindre le jeu');
        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room),
            canBegin: getNbrUser(user.room) > 1 ? true : false,
        });

    });

    socket.on('action', msg => {
        const user = getCurrentUser(socket.id);
        console.log(msg)
        io.to(user.room).emit('message', msg)
    });

    socket.on('startGame', (timeforplay, nbrlife) => {
        //get all players in the room
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        if (user.hote) {
            io.to(user.room).emit('startGame', {
                users: users,
                timeforplay: timeforplay,
                nbrlife: nbrlife,
            });
        }
    });

    socket.on('nbruser', room => {
        io.to(room).emit('nbruser', getNbrUser(room))
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            if (user.hote || getNbrUser(user.room) == 1) {
                io.to(user.room).emit('disconnectAll');
            } else {
                io.to(user.room).emit('message', user.username + ' vient de quitter le jeu');

                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room),
                    nbruser: getNbrUser(user.room)
                })
            }
        }

    })
})

app.use('/asset', express.static(__dirname + '/asset'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/login.html')
});
app.get('/accueil', (req, res) => {
    res.sendFile(__dirname + '/template/accueil.html')
})
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/template/game.html');
})

server.listen(port, () => {
    console.log('[BOMBPARTY] Server app listening on port ' + port);
});