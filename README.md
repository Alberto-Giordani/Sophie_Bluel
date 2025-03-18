# Documentation du projet

## Introduction

Ce projet est un site web dynamique permettant d'afficher, filtrer et gérer les travaux d'un architecte en interagissant avec une API REST. Le projet comprend un système de connexion, une galerie de travaux récupérée dynamiquement, une gestion des filtres et une interface d'administration permettant d'ajouter ou de supprimer des travaux.

## Installation et démarrage

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** et **npm** sur votre ordinateur
- Un serveur API fonctionnel (fournissant les routes d'accès aux données des travaux et de connexion utilisateur)

### Installation du projet

1. Clonez ce dépôt Git sur votre machine :
   ```sh
   git clone <URL_du_repo>
   ```
2. Accédez au dossier du projet :
   ```sh
   cd nom_du_projet
   ```
3. Installez les dépendances du backend :
   ```sh
   cd backend
   npm install
   ```
4. Démarrez le serveur backend :
   ```sh
   npm start
   ```
5. Ouvrez le fichier `index.html` dans votre navigateur pour tester l'interface utilisateur.

### Version en ligne

Le projet est également hébergé sur **GitHub Pages** à l'adresse suivante : [https://alberto-giordani.github.io/Sophie\_Bluel/index.html](https://alberto-giordani.github.io/Sophie_Bluel/index.html)

⚠️ **Attention** : Pour visualiser correctement le contenu du site, vous devez également installer et démarrer l'API en local.

## Validation du code

L'intégralité du code JavaScript a été validée avec ESLint afin de garantir la qualité et la cohérence du code. Le code HTML et CSS de ce projet a été validé par le [W3C Validator](https://validator.w3.org/). Toutes les erreurs et avertissements ont été corrigés pour assurer un respect des bonnes pratiques de développement.

## Fonctionnalités implémentées

### 1. Affichage dynamique des travaux (fetchWorks)

- **Récupération des travaux via l'API :**
  ```js
  async function fetchWorks() {
      const response = await fetch("http://localhost:5678/api/works");
      const works = await response.json();
      addWorks(works);
  }
  ```
- **Affichage des travaux dans la galerie :**
  ```js
  function addWorks(works) {
      const gallery = document.querySelector('.gallery');
      gallery.innerHTML = "";
      for (let i = 0; i < works.length; i++) {
          const mainFigure = document.createElement('figure');
          mainFigure.setAttribute('data-category-id', works[i].categoryId);
          mainFigure.setAttribute('mainFigureId', works[i].id);
          mainFigure.innerHTML = `<img src="${works[i].imageUrl}" alt="${works[i].title}"><figcaption>${works[i].title}</figcaption>`;
          gallery.appendChild(mainFigure);
      }
  }
  ```

### 2. Filtrage des travaux par catégorie

- **Requête API pour récupérer les catégories :**
  ```js
  async function fetchCategories() {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();
      addFiltres(categories);
  }
  ```
- **Gestion des filtres dynamiques :**
  ```js
  function addFiltres(categories) {
      filtres.innerHTML = "";
      for (let i = 0; i < categories.length; i++) {
          const button = document.createElement('button');
          button.classList.add('filtres__btn');
          button.innerHTML = `<span>${categories[i].name}</span>`;
          button.setAttribute('data-category-id', categories[i].id);
          button.addEventListener('click', () => {
              filterWorks(categories[i].id);
          });
          filtres.appendChild(button);
      }
  }
  ```

### 3. Connexion utilisateur et gestion de session

- **Formulaire de connexion et validation des identifiants :**
  ```js
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
                {
                  const data = await response.json();
                  sessionStorage.setItem('token', data.token);
                  window.location.href = "../index.html";
                  break;
                }
              case 401:
                {
                  throw new Error("Erreur dans le mot de passe");
                }
              case 404:
                {
                  throw new Error("Erreur dans l'identifiant");
                }
              default:
                {
                  throw new Error("Problème d'authentification");
                }
          }
      } catch (error) {
          showErrorPopup(error.message);
      }
  }
  ```

### 4. Ajout et suppression des travaux

- **Ajout d'un travail via la modale :**
  ```js
  btnAjout.addEventListener('click', async (e) => {

      try {
          const formData = new FormData();
          formData.append('title', titreInput.value.trim());
          formData.append('category', categorieSelect.value);
          formData.append('image', fileInput.files[0]);

          const response = await fetch('http://localhost:5678/api/works', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${sessionStorage.getItem('token')}`
              },
              body: formData
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText);
          }

          // Met à jour les galeries après l'ajout du projet
          await fetchWorks();
          await fetchWorksModal();
          alert('Projet ajouté avec succès !');
      } catch (error) {
          alert(`Erreur lors de l'envoi des données : ${error.message}`);
      }
  });
  ```

- **Suppression d'un travail :**
  ```js
  async function deleteWorkFromBackEnd(workId) {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
      });
  }

  function removeWorkFromSite(workId) {
      document.querySelector(`.modal__gallery figure[modalFigureId="${workId}"]`)?.remove();
      document.querySelector(`.gallery figure[mainFigureId="${workId}"]`)?.remove();
  }
  ```

## Conclusion

Ce projet implémente une gestion dynamique des travaux d'un architecte en utilisant JavaScript et l'API Fetch pour interagir avec un backend RESTful. Grâce à la gestion des sessions et à une interface utilisateur fluide, l'expérience utilisateur est optimisée.

---

Créé par **Alberto Giordani**
