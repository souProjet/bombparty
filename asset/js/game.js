let player_container = document.querySelector('.player-container');
let info = document.querySelector('.info');
let play = document.querySelector('.play');
let lobby = document.querySelector('.lobby');
let writing = document.querySelector('.writing');
let voting = document.querySelector('.voting');
let slider_dot = document.querySelector('.slider-dot');
let slider_dot_voting = document.querySelector('.slider-dot-voting');
let card_text = document.querySelector('.card-text');
let card_text_voting = document.querySelector('.card-text-voting');
let user_response = document.querySelector('.user-response');
let text_info = document.querySelector('.text-info');
let text_info_voting = document.querySelector('.text-info-voting')
let validating_response = document.querySelector('.validating-response');
let cover_animation = document.querySelector('.cover-animation');
let text_cover_animation = document.querySelector('.text-cover-animation');
let next_arrow = document.querySelector('.next-button-voting');
let previous_arrow = document.querySelector('.previous-button-voting');
let author = document.querySelector('.author');
let voting_choice = document.querySelector('.voting-choice');
let ranking = document.querySelector('.ranking');
let leave = document.querySelector('.leave');

window.addEventListener('load', function() {
    document.body.style.opacity = "1";
    if (!localStorage.getItem("pseudo")) {
        window.location = "/";
    }
});

var socket = io();

//pour la prod 
// lobby.style.display = "none";
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
let nbrround = localStorage.getItem('nbrround');

let responses = [];
let cardslidervote = 1;
let activeAuthorUsername = "";
let activeRound = 1;

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function parseur(unsafe) {
    return unsafe
        .replace(/\[and\]/g, "&amp;")
        .replace(/\[openrafter\]/g, "&lt;")
        .replace(/\[closerafter\]/g, "&gt;")
        .replace(/\[doublequote\]/g, "&quot;")
        .replace(/\[quote\]/g, "&#039;");
}


info.innerHTML = `Code de la partie : ${room}`;

socket.emit('joinRoom', { username, room });
let hote = 0;
let nbruser = 0;
socket.on('roomUsers', ({ room, users, nbruser }) => {
    player_container.innerHTML = '';
    nbruser = nbruser;
    let textinfocontent = text_info.innerText;
    textinfo_nbrfinished = textinfocontent.split(" ")[0];
    text_info.innerText = textinfo_nbrfinished + " / " + parseInt(nbruser) + " terminée" + (nbruser > 1 ? "s" : "");
    for (let i = 0; i < users.length; i++) {
        if (users[i].hote) {
            if (users[i].username == username) {
                hote = 1;
                play.innerText = "JOUER";
                play.style.backgroundColor = "var(--color1opacity)";
                leave.style.width = "70%";
            }
        }
        player_container.innerHTML += `<div style="background-color: var(--color${Math.floor(Math.random()*3)+1});" class="player">${users[i].username == username ? "Moi" : users[i].username}</div>`
    }
})

socket.on('nbruser', nbruser => {
    nbruser = nbruser;
    let textinfocontent = text_info.innerText;
    textinfo_nbrfinished = textinfocontent.split(" ")[0];
    text_info.innerText = textinfo_nbrfinished + " / " + parseInt(nbruser) + " terminée" + (nbruser > 1 ? "s" : "");
    let textinfovotingcontent = text_info_voting.innerText;
    textinfovoting_nbrresponses = textinfovotingcontent.split(" ")[0];
    text_info_voting.innerText = textinfovoting_nbrresponses + " / " + parseInt(nbruser) + " ont voté" + (nbruser > 1 ? "s" : "");
});

play.addEventListener('click', function() {
    if (hote) {
        action("metainfo-" + localStorage.getItem("nbrround") + "-" + localStorage.getItem("timeforplay"));
        action("startgame");
    } else {
        window.location = "/accueil";
    }
});

socket.on('message', message => {
    console.log(message)
    if (message == "startgame") {
        localStorage.setItem("gamestate", 1)
        lobby.style.display = "none";
        voting.style.display = "none";
        writing.style.display = "flex";
        for (let i = 0; i < nbrround; i++) {
            let dot = document.createElement('a');
            dot.classList.add('dot');
            if (i == 0) {
                dot.classList.add('active');
            }
            slider_dot.appendChild(dot);
        }

        //Remplacer par le texte qui a été récupéré dans la base de donnée
        // card_text.innerHTML = "Votre patron vous appele car vous étiez en retard au travail aujourd'hui";

    } else if (message.startsWith("metainfo")) {
        if (!hote) {
            localStorage.setItem("nbrround", message.split("-")[1]);
            localStorage.setItem("timeforplay", message.split("-")[2])

            username = localStorage.getItem('pseudo');
            room = localStorage.getItem('idgame');
            nbrround = localStorage.getItem('nbrround');
        }
    } else if (message == "endround") {
        text_cover_animation.innerText = "Vote !";

        cover_animation.classList.add('active');
        text_cover_animation.classList.add('active');
        setTimeout(function() {
            document.querySelectorAll('.slider-dot-voting .dot').forEach(dot => slider_dot_voting.removeChild(dot))
            for (let i = 0; i < nbrround; i++) {
                let dot = document.createElement('a');
                dot.classList.add('dot');
                if (i == (activeRound - 1)) {
                    dot.classList.add('active');
                }
                slider_dot_voting.appendChild(dot);

            }
            lobby.style.display = "none";
            voting.style.display = "flex";
            writing.style.display = "none";
            cover_animation.classList.remove('active');
            text_cover_animation.classList.remove('active');
        }, 1000)

    } else if (message == "nextround") {
        activeRound++;
        cardslidervote = 1;
        activeAuthorUsername = "";
        responses = [];
        text_cover_animation.innerText = "Manche " + parseInt(activeRound) + " !";
        cover_animation.classList.add('active');
        text_cover_animation.classList.add('active');
        setTimeout(function() {

            lobby.style.display = "none";
            voting.style.display = "none";
            writing.style.display = "flex";
            document.querySelectorAll('.slider-dot .dot')[activeRound - 2].classList.remove('active');
            document.querySelectorAll('.slider-dot .dot')[activeRound - 1].classList.add('active');
            writing.removeChild(document.querySelectorAll('.waiting-response')[0]);
            voting.removeChild(document.querySelectorAll('.waiting-response')[0]);

            voting_choice.style.display = "block";
            user_response.style.display = "block";
            validating_response.style.display = "block";
            text_info.innerText = "0 / 0 terminée";
            text_info_voting.innerText = "0 / 0 ont voté";


            socket.emit('nbruser', room);

            cover_animation.classList.remove('active');
            text_cover_animation.classList.remove('active');
        }, 1000);

    } else if (message == "endgame") {

        text_cover_animation.innerText = "Fin de la partie !";
        cover_animation.classList.add('active');
        text_cover_animation.classList.add('active');

        setTimeout(function() {
            lobby.style.display = "none";
            voting.style.display = "none";
            writing.style.display = "none";
            ranking.style.display = "flex";





            cover_animation.classList.remove('active');
            text_cover_animation.classList.remove('active');
        }, 1000);
    }
});
socket.on('card', card => {
    card_text.innerHTML = parseur(card);

});
socket.on('nbrfinished', nbrfinished => {
    let textinfocontent = text_info.innerText;
    textinfo_nbruser = textinfocontent.split(" ")[2];
    text_info.innerText = parseInt(nbrfinished) + " / " + parseInt(textinfo_nbruser) + " terminée" + (parseInt(textinfo_nbruser) > 1 ? "s" : "");
})
socket.on('nbrvote', nbrvote => {
    let textinfovotingcontent = text_info_voting.innerText;
    textinfovoting_nbrresponses = textinfovotingcontent.split(" ")[2];
    text_info_voting.innerText = parseInt(nbrvote) + " / " + textinfovoting_nbrresponses + " ont voté" + (textinfovoting_nbrresponses > 1 ? "s" : "");
})

socket.on('allresponses', allresponses => {
    for (let i = 0; i < allresponses.length; i++) {
        if (allresponses[i].username != username) {
            responses.push(allresponses[i])
        }
    }
    card_text_voting.innerText = responses[0].response;
    activeAuthorUsername = responses[0].username;
    author.innerText = responses[0].username + " propose :";
    let textinfovotingcontent = text_info_voting.innerText;
    textinfovoting_nbrresponses = textinfovotingcontent.split(" ")[0];
    text_info_voting.innerText = textinfovoting_nbrresponses + " / " + allresponses.length + " ont voté" + (allresponses.length > 1 ? "s" : "");
    verifyapparencebutton();
});
socket.on('allvotes', allvotes => {
    for (let i = 0; i < allvotes.length; i++) {
        document.querySelector('.winner-text').innerText = allvotes[0].username + " à gagné !";
        document.querySelector('tbody').innerHTML +=
            `<tr>
                <td>${allvotes[i].username}</td>
                <td>${allvotes[i].score}</td>
                <td>#${i}</td>
            </tr>`
    }
});
user_response.addEventListener('input', function() {
    this.style.height = 'auto'
    this.style.height = this.scrollHeight + 'px';
    if (this.value.length > 150) {
        validating_response.innerText = "Trop long";
        validating_response.disabled = "disabled"
        validating_response.style.backgroundColor = "rgb(212, 112, 109)";
        validating_response.style.cursor = "not-allowed";
    } else {
        validating_response.removeAttribute('disabled')
        validating_response.innerText = "Valider";
        validating_response.style.backgroundColor = "rgb(109, 212, 109)";
        validating_response.style.cursor = "pointer";
    }
});

validating_response.addEventListener('click', function() {
    if (user_response.value.length <= 150 && user_response.value.length != 0) {
        let response = user_response.value;
        socket.emit('userresponse', { response, username, room });
        user_response.value = '';
        user_response.style.display = "none";
        validating_response.style.display = "none";
        let h2 = document.createElement('h2');
        h2.classList.add('waiting-response');
        h2.innerText = "En attente de toutes les réponses..."
        writing.appendChild(h2);
    }
});

next_arrow.addEventListener('click', function() {
    cardslidervote++;
    verifyapparencebutton();
    activeAuthorUsername = responses[cardslidervote - 1].username;
    card_text_voting.innerText = responses[cardslidervote - 1].response;
    author.innerText = responses[cardslidervote - 1].username + " propose :";
});

previous_arrow.addEventListener('click', function() {
    cardslidervote--;
    verifyapparencebutton();
    activeAuthorUsername = responses[cardslidervote - 1].username;
    card_text_voting.innerText = responses[cardslidervote - 1].response;
    author.innerText = responses[cardslidervote - 1].username + " propose :";
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

voting_choice.addEventListener('click', function() {
    socket.emit('vote', { username, room, activeAuthorUsername, activeRound, nbrround });
    voting_choice.style.display = "none"
    let h2 = document.createElement('h2');
    h2.classList.add('waiting-response');
    h2.innerText = "En attente de toutes les réponses..."
    voting.appendChild(h2);
});

leave.addEventListener('click', function() {
    window.location = "/accueil";
})

function action(message) {
    socket.emit('action', message);
}