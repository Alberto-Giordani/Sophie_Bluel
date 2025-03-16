// Ajoute un écouteur d'événement sur la soumission du formulaire de connexion
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    const email = document.getElementById("email").value; // Récupère l'email saisi
    const password = document.getElementById("password").value; // Récupère le mot de passe saisi
    validerLogin(email, password); // Appelle la fonction de validation de connexion
});

/**
 * Fonction qui envoie une requête de connexion à l'API et gère la réponse
 * @param {string} email - L'email saisi par l'utilisateur
 * @param {string} password - Le mot de passe saisi par l'utilisateur
 */
async function validerLogin(email, password) {
    try {
        // Envoie une requête POST à l'API avec les identifiants
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }) // Convertit les données en JSON
        });

        // Gestion des différents codes de réponse HTTP
        switch (response.status) {
            case 200: // Connexion réussie
                {
                    const data = await response.json(); // Récupère le token de l'utilisateur
                    sessionStorage.setItem('token', data.token); // Stocke le token en session
                    window.location.href = "../index.html"; // Redirige vers la page d'accueil
                    break;
                }
            case 401: // Mot de passe incorrect
                {
                    throw new Error("Erreur dans le mot de passe");
                }
            case 404: // Identifiant incorrect
                {
                    throw new Error("Erreur dans l'identifiant");
                }
            default: // Autre erreur
                {
                    throw new Error("Problème d'authentification");
                }
        }

    } catch (error) {
        showErrorPopup(error.message); // Affiche une pop-up d'erreur
    }
}

/**
 * Affiche une pop-up d'erreur en activant la classe CSS correspondante
 */
function afficherPopup() {
    let popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.add("active");
}

/**
 * Cache la pop-up d'erreur en supprimant la classe CSS correspondante
 */
function cacherPopup() {
    let popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.remove("active");
}

/**
 * Affiche un message d'erreur dans une pop-up et la ferme si l'utilisateur clique en dehors
 * @param {string} error - Le message d'erreur à afficher
 */
function showErrorPopup(error) {
    let popupBackground = document.querySelector(".popupBackground");
    let popup = document.querySelector(".popup");
    popup.innerHTML = ""; // Vide le contenu précédent de la pop-up
    const errorMessage = document.createElement('p'); // Crée un élément <p> pour afficher l'erreur
    errorMessage.innerHTML = error;
    popup.appendChild(errorMessage);
    afficherPopup(); // Affiche la pop-up

    // Ferme la pop-up si l'utilisateur clique en dehors
    popupBackground.addEventListener("click", (event) => {

        if (event.target === popupBackground) {
            cacherPopup();
        }
    })
}