// Sélection des éléments principaux de la page
const filtres = document.querySelector('.filtres'); // Section des filtres
const edition = document.querySelector('.edition'); // Mode édition (admin)
const modifier = document.querySelector('.modifier'); // Bouton pour modifier la galerie
const login = document.getElementById('login'); // Lien vers la page de connexion

/**
 * Ajoute dynamiquement les travaux à la galerie principale
 * @param {Array} works - Liste des travaux récupérés depuis l'API
 */
function addWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const mainFigure = document.createElement('figure');
        mainFigure.setAttribute('data-category-id', works[i].categoryId);
        mainFigure.setAttribute('mainFigureId', works[i].id);
        mainFigure.innerHTML = `<img src="${works[i].imageUrl}" alt="${works[i].title}">
				<figcaption>${works[i].title}</figcaption>`;
        gallery.appendChild(mainFigure);
    }
}

/**
 * Récupère les travaux depuis l'API et les ajoute à la galerie
 */
async function fetchWorks() {
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const worksApi = await responseWorks.json();
    addWorks(worksApi);
}

/**
 * Filtre l'affichage des travaux selon les catégories sélectionnées
 * @param {Set} select - Ensemble des catégories sélectionnées
 */
function updateGalleryDisplay(select) {
    const figures = document.querySelectorAll('.gallery figure');
    if (select.size === 0) {
        // Pas de filtre, on affiche tous les travaux
        figures.forEach(figure => figure.style.display = "");
    } else {
        // On n'affiche que les travaux dont le categoryId est inclus dans le Set
        figures.forEach(figure => {
            const figCategoryId = Number(figure.getAttribute('data-category-id'));
            figure.style.display = select.has(figCategoryId) ? "" : "none";
        });
    }
}

/**
 * Ajoute dynamiquement les boutons de filtres et gère leur interaction
 * @param {Array} categories - Liste des catégories récupérées depuis l'API
 */
function addFiltres(categories) {
    filtres.innerHTML = "";

    const selectedCategories = new Set();

    // Bouton "Tous"
    const filtreTous = document.createElement('button');
    filtreTous.classList.add('filtres__btn', 'filtres__btn--select');
    filtreTous.innerHTML = `<span>Tous</span>`;
    filtreTous.addEventListener('click', () => {
        // Toute selection est effacée : le Set est vidé et on ajoute la class "select" au bouton Tous
        selectedCategories.clear();
        document.querySelectorAll('.filtres__btn').forEach(btn =>
            btn.classList.remove('filtres__btn--select')
        );
        filtreTous.classList.add('filtres__btn--select');
        updateGalleryDisplay(selectedCategories);
    });
    filtres.appendChild(filtreTous);

    // Tous les autres boutons
    for (let i = 0; i < categories.length; i++) {
        const filtreCategories = document.createElement('button');
        filtreCategories.classList.add('filtres__btn');
        filtreCategories.innerHTML = `<span>${categories[i].name}</span>`;
        filtreCategories.setAttribute('data-category-id', categories[i].id);

        filtreCategories.addEventListener('click', () => {
            // Si le filtre est déjà activé on le désélectionne et on revient sur "Tous"
            if (selectedCategories.has(categories[i].id)) {
                selectedCategories.clear();
                document.querySelectorAll('.filtres__btn').forEach(btn => btn.classList.remove('filtres__btn--select'));
                filtreTous.classList.add('filtres__btn--select');
            } else {
                // Sinon on vide le Set (pour qu'il n'y aie qu'une catégorie à la fois),
                // on ajoute la catégorie correspondante et la class "select"
                selectedCategories.clear();
                selectedCategories.add(categories[i].id);
                document.querySelectorAll('.filtres__btn').forEach(btn => btn.classList.remove('filtres__btn--select'));
                filtreCategories.classList.add('filtres__btn--select');
            }
            updateGalleryDisplay(selectedCategories);
        });

        filtres.appendChild(filtreCategories);
    }
}

/**
 * Récupère les catégories depuis l'API et les ajoute aux filtres
 */
async function fetchCategories() {
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categoriesApi = await responseCategories.json();
    addFiltres(categoriesApi);
}

// Chargement initial des données
fetchCategories();
fetchWorks();

// Gestion du bouton login
if (login.innerText === "login") {
    login.href = "./assets/login.html";
}

if (sessionStorage.getItem('token')) {
    // Masquer les filtres et afficher le mode édition si l'utilisateur est connecté
    filtres.classList.add('none');
    edition.classList.remove('none');
    modifier.classList.remove('none');
    login.innerText = "logout";

    // Ajuster l'espacement du titre du portfolio
    let portfolio = document.querySelector("#portfolio h2");
    portfolio.style.marginBottom = "3em";

    // Sélectionner l'overlay et ouvrir la modale lors du clic sur "modifier"
    let overlay = document.querySelector('.overlay');
    modifier.addEventListener('click', () => {
        overlay.style.display = "block";
    });

    // Mettre à jour la galerie de la modale
    fetchWorksModal();

    // Sélectionner les éléments de la modale
    const titreModal = document.querySelector('.modal h3');
    const flecheModal = document.querySelector('.modal__fleche');
    const galleryModal = document.querySelector('.modal__gallery');
    const ajoutModal = document.querySelector('.modal__ajout');
    const btnAjout = document.querySelector('.modal__btn--ajout');

    // Sélectionner les champs du formulaire d'ajout de photo
    const titreInput = document.getElementById('titre');
    const categorieSelect = document.getElementById('categorie');
    const fileInput = document.querySelector('.uploadPreview__input');
    const placeholderImg = document.querySelector('.uploadPreview__placeholder');

    // Gestion de l'aperçu de l'image sélectionnée pour l'upload
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const previewBtn = document.querySelector('.uploadPreview__btn');
        const previewInfo = document.querySelector('.uploadPreview__info');

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Cacher le bouton et les infos, afficher l'image sélectionnée
                previewBtn.classList.add('none');
                previewInfo.classList.add('none');
                placeholderImg.src = event.target.result;

                // Ajuster la taille de l'image pour remplir son conteneur tout en respectant son ratio
                placeholderImg.style.height = '100%';
                placeholderImg.style.width = 'auto';
                placeholderImg.style.objectFit = 'cover';
            };
            reader.readAsDataURL(file);
        }
    });

    // Vérification de la complétion du formulaire avant validation
    function checkFormValidity() {
        const titreValid = titreInput.value.trim() !== '';
        const categorieValid = categorieSelect.value !== '';
        const fileValid = fileInput.files.length > 0;

        // Activer/désactiver le bouton selon la validité des champs
        if (titreValid && categorieValid && fileValid) {
            btnAjout.classList.remove('modal__btn--gris');
        } else {
            btnAjout.classList.add('modal__btn--gris');
        }
    }

    // Attacher la vérification aux événements des champs du formulaire
    titreInput.addEventListener('input', checkFormValidity);
    categorieSelect.addEventListener('change', checkFormValidity);
    fileInput.addEventListener('change', checkFormValidity);

    // Gestion du bouton d'ajout d'un projet
    btnAjout.addEventListener('click', async (e) => {

        // État initial : si le bouton affiche "Ajouter une photo"
        if (btnAjout.innerText === "Ajouter une photo") {
            // Passage à la vue d'ajout de photo
            titreModal.innerText = "Ajout photo";
            flecheModal.classList.remove('none');
            galleryModal.classList.add('none');
            ajoutModal.classList.remove('none');
            btnAjout.innerText = "Valider";
            btnAjout.classList.add('modal__btn--gris');
            return; // Arrêter ici pour ne pas lancer la validation immédiatement
        }

        // État "Valider" : si le bouton est toujours grisé, empêcher l'envoi
        if (btnAjout.classList.contains('modal__btn--gris')) {
            e.preventDefault();
            alert("Tous les champs doivent être remplis");
            return;
        }

        // Si le formulaire est complet, procéder à l'envoi via fetch
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

            switch (response.status) {
                case 201: // Post créé
                    {
                        alert('Projet ajouté avec succès !');
                        break;
                    }
                default:
                    {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }
            }

            // Mettre à jour la galerie principale et celle de la modale
            await fetchWorks();
            await fetchWorksModal();


        } catch (error) {
            alert(`Erreur lors de l'envoi des données : ${error.message}`); // Affiche un message d'erreur
        }
    });

    // Gestion du retour à la galerie en cliquant sur la flèche
    flecheModal.addEventListener('click', () => {
        titreModal.innerText = "Galerie photo";
        flecheModal.classList.add('none');
        ajoutModal.classList.add('none');
        galleryModal.classList.remove('none');
        btnAjout.innerText = "Ajouter une photo";
        btnAjout.classList.remove('modal__btn--gris');
    });

    // Fermeture de la modale en cliquant sur la croix
    let btnClose = document.querySelector('.modal__btn--close');
    btnClose.addEventListener('click', () => {
        overlay.style.display = "none";
    });
}

// Gestion du bouton logout
if (login.innerText === "logout") {
    login.addEventListener('click', () => {
        sessionStorage.clear();
        login.innerText = "login";
        login.href = "./index.html"
    });
}

/**
 * Ajoute dynamiquement les projets à la galerie de la modale
 * @param {Array} works - Liste des travaux récupérés depuis l'API
 */
function addWorksModal(works) {
    const galleryModal = document.querySelector('.modal__gallery');
    galleryModal.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const modalFigure = document.createElement('figure');
        modalFigure.innerHTML = `<img src="${works[i].imageUrl}" class="modal__grid--item">`;
        modalFigure.setAttribute('modalFigureId', works[i].id);
        const iconeTrash = document.createElement('img');
        iconeTrash.classList.add('modal__grid--icone');
        iconeTrash.src = './assets/icons/Trash.svg';
        iconeTrash.setAttribute('iconeId', works[i].id);

        // Gestion de la suppression d'un projet
        iconeTrash.addEventListener('click', () => {
            const iconeId = iconeTrash.getAttribute('iconeId');

            deleteWorkFromBackEnd(iconeId);
            removeWorkFromSite(iconeId);
        })

        modalFigure.appendChild(iconeTrash);
        galleryModal.appendChild(modalFigure);
    }
}

/**
 * Récupère les travaux depuis l'API pour la galerie de la modale
 */
async function fetchWorksModal() {
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const worksApi = await responseWorks.json();
    addWorksModal(worksApi);
}

/**
 * Supprime un projet de l'API
 * @param {number} workId - Identifiant du projet à supprimer
 */
async function deleteWorkFromBackEnd(workId) {
    const token = sessionStorage.getItem('token');
    await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

/**
 * Supprime un projet de la galerie principale et de la modale
 * @param {number} workId - Identifiant du projet à supprimer
 */
function removeWorkFromSite(workId) {
    const modalFigure = document.querySelector(`.modal__gallery figure[modalFigureId="${workId}"]`);
    if (modalFigure) {
        modalFigure.remove();
    }

    const mainFigure = document.querySelector(`.gallery figure[mainFigureId="${workId}"]`);
    if (mainFigure) {
        mainFigure.remove();
    }

}