const moviesContainer = document.getElementById("moviesContainer");
const singleMovieContainer = document.getElementById("singleMovieContainer");
const message = document.getElementById("message");

const getMoviesBtn = document.getElementById("getMoviesBtn");
const getMovieBtn = document.getElementById("getMovieBtn");

const movieIdInput = document.getElementById("movieIdInput");

const addMovieForm = document.getElementById("addMovieForm");
const updateMovieForm = document.getElementById("updateMovieForm");

const categorySelect = document.getElementById("categoryId");
const updateCategorySelect = document.getElementById("updateCategoryId");

const API_MOVIES = "http://localhost:3000/movies";
const API_CATEGORIES = "http://localhost:3000/categories";

let categories = [];

async function getMovies() {
  try {
    const response = await fetch("http://localhost:3000/movies");

    if (!response.ok) {
      throw new Error("Kunde inte hämta filmer.");
    }

    const movies = await response.json();
    renderMovies(movies);
  } catch (error) {
    console.log(error);
  }
}

function renderMovies(movies) {
  moviesContainer.replaceChildren();

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieImage = document.createElement("img");
    movieImage.src = movie.image;
    movieImage.alt = movie.title;

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;

    const movieYear = document.createElement("p");
    movieYear.textContent = `År: ${movie.year}`;

    const movieRating = document.createElement("p");
    movieRating.textContent = `Betyg: ${movie.rating}`;

    const movieCategory = document.createElement("p");
    const category = categories.find((cat) => cat.id === movie.categoryId);
    movieCategory.textContent = `Kategori: ${category ? category.name : "Okänd"}`;

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieTitle);
    movieCard.appendChild(movieYear);
    movieCard.appendChild(movieRating);
    movieCard.appendChild(movieCategory);

    moviesContainer.appendChild(movieCard);

  });
}

async function getCategories() {
  const response = await fetch("http://localhost:3000/categories");
  categories = await response.json();

  console.log(categories);
  renderCategoryOptions();
}

async function init() {
  await getCategories();
  await getMovies();
}

init();

function renderCategoryOptions() {
  categorySelect.replaceChildren();
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Välj kategori";

  categorySelect.appendChild(defaultOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;

    categorySelect.appendChild(option);
  });
}

addMovieForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById("title").value,
    year: Number(document.getElementById("year").value),
    rating: Number(document.getElementById("rating").value),
    image: document.getElementById("image").value,
    categoryId: Number(categorySelect.value),
  };

  addMovie(newMovie);
});

async function addMovie(newMovie) {
  const response = await fetch("http://localhost:3000/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  });

  const data = await response.json();
  console.log(data);
}