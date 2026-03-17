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

getMovies();

function renderMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    moviesContainer.innerHTML += `
      <div>
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>År: ${movie.year}</p>
        <p>Betyg: ${movie.rating}</p>
      </div>
    `;
  });
}