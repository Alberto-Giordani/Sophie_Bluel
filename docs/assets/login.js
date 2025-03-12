document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    validerLogin(email, password);
});

async function validerLogin(email, password) {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        switch (response.status) {
            case 200:
                const data = await response.json();
                sessionStorage.setItem('token', data.token);
                window.location.href = "../index.html";
                break;
            case 401:
                throw new Error("Erreur dans le mot de passe");
            case 404:
                throw new Error("Erreur dans l'identifiant");
            default:
                throw new Error("Problème d'authentification");
        }

    } catch (error) {
        showErrorPopup(error.message);
    }
}

function afficherPopup() {
    let popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.add("active");
}


function cacherPopup() {
    let popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.remove("active");
}

function showErrorPopup(error) {
    let popupBackground = document.querySelector(".popupBackground");
    let popup = document.querySelector(".popup");
    popup.innerHTML = "";
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = error;
    popup.appendChild(errorMessage);
    afficherPopup();

    popupBackground.addEventListener("click", (event) => {

        if (event.target === popupBackground) {
            cacherPopup();
        }
    })
}