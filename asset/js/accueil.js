let inputcode = document.querySelector('.input-code');
let join = document.querySelector('.join');
let create = document.querySelector('.create');
let container = document.querySelector('.container');
let createcontainer = document.querySelector('.create-container');
let close = document.querySelector('.close');
let sharelink = document.querySelector('.sharelink');
let error = document.querySelector('.error')

let startgame = document.querySelector('.startgame');
let input_timeforplay = document.querySelector('.input-timeforplay');
let input_nbrround = document.querySelector('.input-nbrround');;
let idgame = document.querySelector('.idgame');
let error_create = document.querySelector('.error-create');

localStorage.removeItem("nbrround");
localStorage.removeItem("timeforplay");
localStorage.removeItem("gamestate");
localStorage.removeItem("idgame");

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


sharelink.addEventListener('click', function() {
    sharelink.style.color = "#65DC4A";
    navigator.clipboard.writeText(sharelink.innerText)
        .then(() => {
            setTimeout(function() {
                sharelink.style.color = "white";
            }, 2000)
        })
        .catch(err => {
            console.log('Something went wrong', err);
        })

});

join.addEventListener('click', function() {
    let msgerror;
    if (inputcode.value.length <= 4) {
        if (inputcode.value.length != 0) {
            localStorage.setItem('idgame', inputcode.value.toUpperCase());
            window.location.href = "/game";
        } else {
            msgerror = "Veuillez rentrer un code pour rejoindre une partie";
        }
    } else {
        msgerror = "Le code est composé de 4 caractères";
    }
    if (msgerror) {
        error.innerText = msgerror;
    }
})

create.addEventListener('click', function() {
    let generateidgame = makeid(4)
    idgame.innerText = generateidgame;
    sharelink.innerText = "https://localhost:8000/game/" + generateidgame
    container.style.opacity = ".2";
    createcontainer.classList.add('active');
});

document.addEventListener('keyup', (e) => { e.code == "Escape" ? unfocuscreatecontainer() : "" })
close.addEventListener('click', () => { unfocuscreatecontainer() });

function unfocuscreatecontainer() {
    createcontainer.classList.remove('active');
    container.style.opacity = "1";

}
window.addEventListener('load', function() {
    document.body.style.opacity = "1";
    if (!localStorage.getItem("pseudo")) {
        window.location = "/";
    }
})

startgame.addEventListener('click', function() {
    let msgerror;
    let timeforplay_minute = parseInt(input_timeforplay.value.split(":")[0]);
    let timeforplay_second = parseInt(input_timeforplay.value.split(":")[1]);
    if (input_timeforplay.value != "") {
        if (!(timeforplay_minute <= 0 && timeforplay_second <= 30)) {
            if (!(timeforplay_minute >= 5 && timeforplay_second > 0)) {
                if (input_nbrround.value >= 1) {
                    if (input_nbrround.value <= 15) {
                        localStorage.setItem('idgame', idgame.innerText);
                        localStorage.setItem('timeforplay', input_timeforplay.value);
                        localStorage.setItem('nbrround', input_nbrround.value);
                        window.location.href = "/game";
                    } else {
                        msgerror = "Le nombre de manche maximum est 15";
                    }
                } else {
                    msgerror = "Le nombre de manche minimum est 1";
                }
            } else {
                msgerror = "Le temps maximum pour jouer est de 5 minutes"
            }
        } else {
            msgerror = "Le temps minimum pour jouer est de 30 secondes";
        }
    } else {
        msgerror = "Veuillez rentrer un temps pour jouer"
    }
    if (msgerror) {
        error_create.innerText = msgerror;
    }
})