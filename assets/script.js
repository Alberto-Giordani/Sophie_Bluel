async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const worksApi = await response.json();
    addWorks(worksApi);
}

function addWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${works[i].imageUrl}" alt="${works[i].title}">
				<figcaption>${works[i].title}</figcaption>`;
        gallery.appendChild(figure);
    }
}

fetchWorks();