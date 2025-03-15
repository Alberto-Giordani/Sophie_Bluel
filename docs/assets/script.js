const filtres = document.querySelector('.filtres');
const edition = document.querySelector('.edition');
const modifier = document.querySelector('.modifier');
const login = document.getElementById('login');

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

async function fetchWorks() {
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const worksApi = await responseWorks.json();
    addWorks(worksApi);
}

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

async function fetchCategories() {
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categoriesApi = await responseCategories.json();
    addFiltres(categoriesApi);
}


fetchCategories();
fetchWorks();

if (login.innerText === "login") {
    login.href = "./assets/login.html";
}

if (sessionStorage.getItem('token')) {
    filtres.classList.add('none');
    edition.classList.remove('none');
    modifier.classList.remove('none');
    login.innerText = "logout";
    let portfolio = document.querySelector("#portfolio h2");
    portfolio.style.marginBottom = "3em";

    let overlay = document.querySelector('.overlay');

    modifier.addEventListener('click', () => {
        overlay.style.display = "block";
    });

    fetchWorksModal();

    let btnClose = document.querySelector('.modal__btn--close');

    btnClose.addEventListener('click', () => {
        overlay.style.display = "none";
    });
}

if (login.innerText === "logout") {
    login.addEventListener('click', () => {
        sessionStorage.clear();
        login.innerText = "login";
        login.href = "./index.html"
    });
}

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

        iconeTrash.addEventListener('click', () => {
            const iconeId = iconeTrash.getAttribute('iconeId');

            deleteWorkFromBackEnd(iconeId);
            removeWorkFromSite(iconeId);
        })

        modalFigure.appendChild(iconeTrash);
        galleryModal.appendChild(modalFigure);
    }
}

async function fetchWorksModal() {
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const worksApi = await responseWorks.json();
    addWorksModal(worksApi);
}

async function deleteWorkFromBackEnd(workId) {
    const token = sessionStorage.getItem('token');
    await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

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