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
let input_nbrlife = document.querySelector('.input-nbrlife');;
let idgame = document.querySelector('.idgame');
let error_create = document.querySelector('.error-create');

localStorage.removeItem("nbrlife");
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

input_timeforplay.addEventListener('input', function() {
    document.querySelector('.label-timeforplay').innerHTML = "Temps pour répondre (" + input_timeforplay.value + "s) :";
});
input_nbrlife.addEventListener('input', function() {
    document.querySelector('.label-nbrlife').innerHTML = "Nombre de vie (" + input_nbrlife.value + ") :";
});

startgame.addEventListener('click', function() {
    let msgerror;
    let timeforplay = parseInt(input_timeforplay.value);
    if (input_timeforplay.value != "") {
        if (timeforplay >= 2) {
            if (timeforplay <= 15) {
                if (parseInt(input_nbrlife.value) >= 2) {
                    if (parseInt(input_nbrlife.value) <= 10) {
                        localStorage.setItem('idgame', idgame.innerText);
                        localStorage.setItem('timeforplay', input_timeforplay.value);
                        localStorage.setItem('nbrlife', input_nbrlife.value);
                        window.location.href = "/game";
                    } else {
                        msgerror = "Le nombre de vie maximum est 10";
                    }
                } else {
                    msgerror = "Le nombre de vie minimum est 2";
                }
            } else {
                msgerror = "Le temps maximum pour jouer est de 15 secondes";
            }
        } else {
            msgerror = "Le temps minimum pour jouer est de 2 secondes";
        }
    } else {
        msgerror = "Veuillez rentrer un temps pour jouer"
    }
    if (msgerror) {
        error_create.innerText = msgerror;
    }
})