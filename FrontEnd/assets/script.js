async function fetchWorks() {
    const responseWorks = await fetch("http://localhost:5678/api/works");
    const worksApi = await responseWorks.json();
    addWorks(worksApi);
}

function addWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement('figure');
        figure.setAttribute('data-category-id', works[i].categoryId);
        figure.innerHTML = `<img src="${works[i].imageUrl}" alt="${works[i].title}">
				<figcaption>${works[i].title}</figcaption>`;
        gallery.appendChild(figure);
    }
}

fetchWorks();

async function fetchCategories() {
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categoriesApi = await responseCategories.json();
    addFiltres(categoriesApi);
}

function addFiltres(categories) {
    const filtres = document.querySelector('.filtres');
    filtres.innerHTML = "";

    // Bouton "Tous"
    const filtreTous = document.createElement('button');
    // De base tous les travaux sont affichés
    filtreTous.classList.add('filtres__btn', 'filtres__btn--select');

    filtreTous.innerHTML = `<span>Tous</span>`;
    filtreTous.addEventListener('click', () => {
        // Quand on le selectionne on enlève la class "select" aux autres boutons
        document.querySelectorAll('.filtres__btn').forEach(btn => {
            btn.classList.remove('filtres__btn--select');
        });
        // et on l'ajoute au bouton "Tous"
        filtreTous.classList.add('filtres__btn--select');

        // On affiche tous les travaux
        document.querySelectorAll('.gallery figure').forEach(figure => {
            figure.style.display = "";
        });
    });
    filtres.appendChild(filtreTous);

    // Tous les autres boutons
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const filtreCategories = document.createElement('button');
        filtreCategories.classList.add('filtres__btn');
        filtreCategories.innerHTML = `<span>${category.name}</span>`;
        filtreCategories.setAttribute('data-category-id', category.id);

        filtreCategories.addEventListener('click', () => {
            // Quand on le selectionne on enlève la class "select" aux autres boutons
            document.querySelectorAll('.filtres__btn').forEach(btn => {
                btn.classList.remove('filtres__btn--select');
            });
            // Et on l'ajoute au bouton actuel
            filtreCategories.classList.add('filtres__btn--select');

            // On filtre les travaux avec le categoryId
            document.querySelectorAll('.gallery figure').forEach(figure => {
                const figCategoryId = parseInt(figure.getAttribute('data-category-id'));
                console.log(parseInt(figure.getAttribute('data-category-id')));
                // Si le categoryId d'une figure correspond à celui du bouton on affiche la figure, 
                // sinon on l'enlève
                if (figCategoryId === category.id) {
                    figure.style.display = "";
                } else {
                    figure.style.display = "none";
                }
            });
        });

        filtres.appendChild(filtreCategories);
    }
}

fetchCategories();