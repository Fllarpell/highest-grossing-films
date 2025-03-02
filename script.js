document.addEventListener("DOMContentLoaded", function() {
    fetchFilms();
    document.getElementById('search').addEventListener('input', filterFilms);
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortFilms);
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

let filmsData = [];

function fetchFilms() {
    fetch("films_data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("network error");
            }
            return response.json();
        })
        .then(data => {
            filmsData = data;
            renderFilms(data);
        })
        .catch(error => {
            console.error("uploading error:", error);
        });
}

function renderFilms(films) {
    const container = document.getElementById("films-container");
    container.innerHTML = "";
    films.forEach(film => {
        const card = document.createElement("div");
        card.className = "film-card";
        card.innerHTML = `
            <h3>${film.title}</h3>
            <p><strong>release year:</strong> ${film.release_year || "N/A"}</p>
            <p><strong>directors:</strong> ${film.director || "N/A"}</p>
            <p><strong>box office:</strong> ${film.box_office ? film.box_office + "$" : "N/A"}</p>
            <p><strong>countries:</strong> ${film.country || "N/A"}</p>
            <img src="${film.image_url}" alt="${film.title}">
        `;
        container.appendChild(card);
        
        observer.observe(card);
    });
}

function filterFilms() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredFilms = filmsData.filter(film => film.title.toLowerCase().includes(query));
    const sortSelect = document.getElementById('sort');
    if (sortSelect && sortSelect.value !== "none") {
        renderFilms(sortArray(filteredFilms, sortSelect.value));
    } else {
        renderFilms(filteredFilms);
    }
}

function sortFilms() {
    const sortSelect = document.getElementById('sort');
    if (!sortSelect) return;
    const criterion = sortSelect.value;
    let filmsToSort = filmsData.slice();
    const searchQuery = document.getElementById('search').value.toLowerCase();
    if (searchQuery) {
        filmsToSort = filmsToSort.filter(film => film.title.toLowerCase().includes(searchQuery));
    }
    const sortedFilms = sortArray(filmsToSort, criterion);
    renderFilms(sortedFilms);
}

function sortArray(array, criterion) {
    if (criterion === 'title') {
        return array.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criterion === 'year') {
        return array.sort((a, b) => a.release_year - b.release_year);
    } else if (criterion === 'box_office') {
        return array.sort((a, b) => b.box_office - a.box_office);
    }
    return array;
}
