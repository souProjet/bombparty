let player_container = document.querySelector('.player-container');
let info = document.querySelector('.info');
let play = document.querySelector('.play');
let lobby = document.querySelector('.lobby');
let cover_animation = document.querySelector('.cover-animation');
let text_cover_animation = document.querySelector('.text-cover-animation');
let game = document.querySelector('.game');
let players = document.querySelector('.players');
window.addEventListener('load', function() {
    document.body.style.opacity = "1";
    if (!localStorage.getItem("pseudo")) {
        window.location = "/";
    }
});

var socket = io();

//pour la prod 
//lobby.style.display = "none";
// ranking.style.display = "flex"

// if (localStorage.getItem("gamestate") == 1) {
//     window.location = "/accueil"
// }

// window.addEventListener('orientationchange', function() {
//     let portraitOrientation = window.matchMedia("(orientation:portrait)");
//     if (portraitOrientation.matches) {
//         document.body.style.display = "none";

//     } else {
//         document.body.style.display = "block";
//     }

// });

let username = localStorage.getItem('pseudo');
let room = localStorage.getItem('idgame');
let nbrlife = localStorage.getItem('nbrlife');

info.innerHTML = `Code de la partie : ${room}`;

socket.emit('joinRoom', { username, room });
let hote = 0;
let canBeginState = false;
let nbruser = 0;
socket.on('roomUsers', ({ users, canBegin }) => {
    player_container.innerHTML = '';
    nbruser = users.length;
    for (let i = 0; i < users.length; i++) {
        if (users[i].hote) {
            if (canBegin) {
                if (users[i].username == username) {
                    hote = 1;
                    play.innerText = "JOUER";
                    play.style.backgroundColor = "var(--color1opacity)";
                } else {
                    play.innerText = "EN ATTENTE DE L'HOTE";
                    play.style.backgroundColor = "var(--color2opacity)";
                }
                canBeginState = true;
            } else {
                play.innerText = "QUITTER";
                play.style.backgroundColor = "var(--red)";
            }
        }
        player_container.innerHTML += `<div style="background-color: var(--color${Math.floor(Math.random()*3)+1});" class="player">${users[i].username == username ? "Moi" : users[i].username}</div>`
    }
})

play.addEventListener('click', function() {
    if (hote) {
        //action("metainfo-" + localStorage.getItem("nbrlife") + "-" + localStorage.getItem("timeforplay"));
        socket.emit('startGame', {
            timeforplay: localStorage.getItem("timeforplay"),
            nbrlife: localStorage.getItem("nbrlife")
        });
    } else if (!canBeginState) {
        window.location = "/accueil";
    }
});

socket.on('message', message => {
    console.log(message);
});

socket.on('startGame', (users, timeforplay, nbrlife) => {
    localStorage.setItem("gamestate", 1);
    localStorage.setItem("timeforplay", timeforplay);
    localStorage.setItem("nbrlife", nbrlife);
    lobby.style.display = "none";

    text_cover_animation.innerText = "Début de la partie";

    cover_animation.classList.add('active');
    text_cover_animation.classList.add('active');
    setTimeout(function() {

        //afficher le jeu 
        game.style.display = "flex";

        for (let i = 0; i < users.length; i++) {
            players.innerHTML += `<div style="background-color: var(--color${Math.floor(Math.random()*3)+1});" class="player">${users[i].username == username ? "Moi" : users[i].username}</div>`;
        }



        cover_animation.classList.remove('active');
        text_cover_animation.classList.remove('active');
    }, 1000)

});

socket.on('disconnectAll', () => {
    window.location = "/accueil";
});

function verifyapparencebutton() {
    if (cardslidervote == responses.length) {
        next_arrow.style.display = "none";
    } else {
        next_arrow.style.display = "block";
    }
    if (cardslidervote > 1) {
        previous_arrow.style.display = "block";
    } else {
        previous_arrow.style.display = "none";
    }
}