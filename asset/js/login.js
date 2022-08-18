let inputpseudo = document.querySelector('.input-pseudo');
let continuer = document.querySelector('.continuer');
let error = document.querySelector('.error')

continuer.addEventListener('click', () => { login() });
document.addEventListener('keyup', (e) => { e.code == "Enter" ? login() : "" })

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function login() {
    if (inputpseudo.value.length != 0) {
        if (inputpseudo.value.length >= 3) {
            if (inputpseudo.value.length <= 20) {
                localStorage.setItem("pseudo", escapeHtml(inputpseudo.value));
                error.innerText = ""
                document.body.style.opacity = "0";
                window.location = "accueil";
            } else {
                error.innerText = "Votre pseudo ne peut pas dépasser les 20 caractères"
            }
        } else {
            error.innerText = "Votre pseudo doit contenir minimum 3 caractères"
        }
    } else {
        error.innerText = "Veuillez saisir un pseudo"
    }
}

window.addEventListener('load', function() {
    document.body.style.opacity = "1";
    inputpseudo.value = escapeHtml(localStorage.getItem("pseudo") || "");
})