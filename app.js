const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getNbrUser } = require('./users.js')
const { responseJoin, getResponses, getNbrResponses, deleteResponses } = require('./response.js');
const { voteJoin, getNbrVotes, deleteVotes, deleteActiveVotes, getAllVotes } = require('./vote.js');

const port = 5000;

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', 'Bienvenu dans le jeu !');

        socket.broadcast.to(user.room).emit('message', user.username + ' vient de rejoindre le jeu');
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
            nbruser: getNbrUser(user.room)
        })

    });

    socket.on('userresponse', ({ response, username, room }) => {
        const responseJSON = responseJoin(response, socket.id, username, room);
        let nbrresponses = getNbrResponses(responseJSON.room);
        io.to(responseJSON.room).emit('nbrfinished', nbrresponses);
        if (nbrresponses >= getNbrUser(responseJSON.room)) {
            io.to(responseJSON.room).emit('message', 'endround');
            io.to(responseJSON.room).emit('allresponses', getResponses(responseJSON.room))
            deleteResponses(responseJSON.room);
        }

    });

    socket.on('vote', ({ username, room, activeAuthorUsername, activeRound, nbrround }) => {
        const voteJSON = voteJoin(username, socket.id, room, activeAuthorUsername, activeRound);
        let nbrvotes = getNbrVotes(voteJSON.room, voteJSON.activeRound);
        io.to(voteJSON.room).emit('nbrvote', nbrvotes);
        if (nbrvotes >= getNbrUser(voteJSON.room)) {
            if (parseInt(activeRound) == parseInt(nbrround)) {
                io.to(voteJSON.room).emit('message', 'endgame');
                let stats = []

                for (let i = 0; i < getAllVotes(voteJSON.room).length; i++) {
                    let user = stats.find(user => user.username === getAllVotes(voteJSON.room)[i].activeAuthorUsername)
                    if (user) {
                        let index = stats.indexOf(user)
                        stats[index].score++
                    } else {
                        stats.push({
                            username: getAllVotes(voteJSON.room)[i].activeAuthorUsername,
                            score: 1,
                        })
                    }
                }
                stats.sort((a, b) => b.score - a.score)
                io.to(voteJSON.room).emit('allvotes', stats)
                deleteVotes(voteJSON.room)
            } else {
                io.to(voteJSON.room).emit('message', 'nextround');
                deleteActiveVotes(voteJSON.room);
            }
        }
    });

    socket.on('action', msg => {

        const user = getCurrentUser(socket.id);

        if (msg == "startgame" || msg == "nextround") {
            console.log("startgame or nextround")
        }
        io.to(user.room).emit('message', msg)
    });

    socket.on('nbruser', room => {
        io.to(room).emit('nbruser', getNbrUser(room))
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', user.username + ' vient de quitter le jeu');

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
                nbruser: getNbrUser(user.room)
            })
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