const moviesContainer = document.getElementById("moviesContainer");
const moviesMessage = document.getElementById("moviesMessage");
const message = document.getElementById("message");

const searchMessage = document.getElementById("searchMessage");
const idMessage = document.getElementById("idMessage");
const addMovieMessage = document.getElementById("addMovieMessage");

const getMoviesBtn = document.getElementById("getMoviesBtn");
const getMovieBtn = document.getElementById("getMovieBtn");
const searchBtn = document.getElementById("searchBtn");

const movieIdInput = document.getElementById("movieIdInput");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

const addMovieForm = document.getElementById("addMovieForm");
const categorySelect = document.getElementById("categoryId");

const API_MOVIES = "http://localhost:3000/movies";
const API_CATEGORIES = "http://localhost:3000/categories";

let categories = [];
let movies = [];

// Hämta alla filmer
async function getMovies() {
  try {
    const response = await fetch(API_MOVIES);

    if (!response.ok) {
      throw new Error("Kunde inte hämta filmer.");
    }

    movies = await response.json();
    renderMovies(movies);
  } catch (error) {
    console.log(error);
    message.textContent = error.message;
  }
}

// Hämta kategorier
async function getCategories() {
  try {
    const response = await fetch(API_CATEGORIES);

    if (!response.ok) {
      throw new Error("Kunde inte hämta kategorier.");
    }

    categories = await response.json();
    renderCategoryOptions();
  } catch (error) {
    console.log(error);
    message.textContent = error.message;
  }
}

// Hämta en film via ID
async function getMovieById(id) {
  try {
    const response = await fetch(`${API_MOVIES}/${id}`);

    if (!response.ok) {
      throw new Error("Kunde inte hitta filmen.");
    }

    const movie = await response.json();

    idMessage.textContent = "";
    moviesMessage.textContent = "";
    message.textContent = "";
    renderMovies([movie]);
  } catch (error) {
    idMessage.textContent = error.message;
  }
}

function handleGetMovieById() {
  const id = movieIdInput.value.trim();

  idMessage.textContent = "";

  if (!id) {
    idMessage.textContent = "Skriv in ett id.";
    return;
  }

  getMovieById(id);
}

// Visa filmer
function renderMovies(movieList) {
  moviesContainer.replaceChildren();

  movieList.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieImage = document.createElement("img");
    movieImage.src = movie.image || "";
    movieImage.alt = movie.title;

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;

    const movieId = document.createElement("p");
    movieId.textContent = `Film-ID: ${movie.id}`;
    movieId.classList.add("movie-id");

    const movieYear = document.createElement("p");
    movieYear.textContent = `År: ${movie.year}`;

    const movieRating = document.createElement("div");
    movieRating.classList.add("rating");

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = "★";
      star.classList.add("star");

      if (i <= movie.rating) {
        star.classList.add("active");
      }

      movieRating.appendChild(star);
    }

    const movieCategory = document.createElement("p");
    const category = categories.find(
      (cat) => Number(cat.id) === Number(movie.categoryId)
    );
    movieCategory.textContent = `Kategori: ${category ? category.name : "Okänd"}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Redigera rating";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => {
      editMovieRating(movie);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Ta bort";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteMovie(movie.id);
    });

    movieCard.append(
      movieImage,
      movieTitle,
      movieId,
      movieYear,
      movieRating,
      movieCategory,
      editBtn,
      deleteBtn
    );

    moviesContainer.appendChild(movieCard);
  });
}

// Kategorier
function renderCategoryOptions() {
  categorySelect.replaceChildren();
  filterCategory.replaceChildren();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Välj kategori";

  const filterDefaultOption = document.createElement("option");
  filterDefaultOption.value = "";
  filterDefaultOption.textContent = "Alla kategorier";

  categorySelect.appendChild(defaultOption);
  filterCategory.appendChild(filterDefaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;

    const filterOption = document.createElement("option");
    filterOption.value = category.id;
    filterOption.textContent = category.name;

    categorySelect.appendChild(option);
    filterCategory.appendChild(filterOption);
  });
}

// Sök och filtrera
function filterMovies() {
  let filteredMovies = [...movies];

  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = Number(filterCategory.value);

  if (!searchText && !selectedCategory) {
    searchMessage.textContent = "Skriv in en filmtitel eller välj en kategori.";
    return;
  }

  if (searchText) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchText)
    );
  }

  if (selectedCategory) {
    filteredMovies = filteredMovies.filter(
      (movie) => Number(movie.categoryId) === selectedCategory
    );
  }

  if (filteredMovies.length === 0) {
    searchMessage.textContent = "Inga filmer matchade sökningen.";
  } else {
    searchMessage.textContent = "";
  }

  moviesMessage.textContent = "";
  renderMovies(filteredMovies);
}

// Sök med knapp och enter
searchBtn.addEventListener("click", filterMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    filterMovies();
  }
});

searchInput.addEventListener("search", () => {
  if (!searchInput.value.trim() && !filterCategory.value) {
    showAllMovies();
  } else {
    filterMovies();
  }
});

// Filtrera när kategori ändras
filterCategory.addEventListener("change", filterMovies);

// Visa alla filmer igen
getMoviesBtn.addEventListener("click", showAllMovies);

function refreshVisibleMovies() {
  const hasSearch = searchInput.value.toLowerCase().trim() !== "";
  const hasCategory = filterCategory.value !== "";

  if (hasSearch || hasCategory) {
    filterMovies();
  } else {
    searchMessage.textContent = "";
    moviesMessage.textContent = "";
    renderMovies(movies);
  }
}

// Hämta film via id med knapp och Enter
getMovieBtn.addEventListener("click", handleGetMovieById);

movieIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleGetMovieById();
  }
});

movieIdInput.addEventListener("search", () => {
  if (!movieIdInput.value.trim()) {
    showAllMovies();
  }
});

// Visa alla filmer igen efter sökning
function showAllMovies() {
  searchInput.value = "";
  filterCategory.value = "";
  movieIdInput.value = "";

  searchMessage.textContent = "";
  idMessage.textContent = "";
  moviesMessage.textContent = "";
  addMovieMessage.textContent = "";
  message.textContent = "";

  renderMovies(movies);
}

// Lägg till film
async function addMovie(newMovie) {
  addMovieMessage.textContent = "";

  try {
    const response = await fetch(API_MOVIES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error("Kunde inte lägga till filmen.");
    }

    await response.json();

    addMovieForm.reset();
    await getMovies();
    refreshVisibleMovies();
  } catch (error) {
    console.log(error);
    addMovieMessage.textContent = error.message;
  }
}

// Formulär för att lägga till film
addMovieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  addMovieMessage.textContent = "";
  message.textContent = "";

  const newMovie = {
    title: document.getElementById("title").value,
    year: Number(document.getElementById("year").value),
    rating: Number(document.getElementById("rating").value),
    image: document.getElementById("image").value,
    categoryId: Number(categorySelect.value),
  };

  await addMovie(newMovie);
});

// Ta bort film
async function deleteMovie(id) {
  try {
    moviesMessage.textContent = "";

    const response = await fetch(`${API_MOVIES}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Kunde inte ta bort filmen.");
    }

    await getMovies();
    refreshVisibleMovies();
  } catch (error) {
    moviesMessage.textContent = error.message;
  }
}

// Uppdatera rating
async function editMovieRating(movie) {
  moviesMessage.textContent = "";

  const newRating = Number(prompt("Ange nytt betyg mellan 1 och 5:"));

  if (!newRating || newRating < 1 || newRating > 5) {
    moviesMessage.textContent = "Betyget måste vara mellan 1 och 5.";
    return;
  }

  const updatedMovie = {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    rating: newRating,
    image: movie.image,
    categoryId: movie.categoryId,
  };

  try {
    const response = await fetch(`${API_MOVIES}/${movie.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      throw new Error("Kunde inte uppdatera filmen.");
    }

    await getMovies();
    refreshVisibleMovies();
  } catch (error) {
    moviesMessage.textContent = error.message;
  }
}

// Starta appen
async function init() {
  await getCategories();
  await getMovies();
}

init();