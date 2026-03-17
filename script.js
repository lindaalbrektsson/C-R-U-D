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
    const response = await fetch(API_MOVIES);

    if (!response.ok) {
      throw new Error("Kunde inte hämta filmer.");
    }

    const movies = await response.json();
    renderMovies(movies);
  } catch (error) {
    console.log(error);
    message.textContent = error.message;
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

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieTitle);
    movieCard.appendChild(movieYear);
    movieCard.appendChild(movieRating);
    movieCard.appendChild(movieCategory);
    movieCard.appendChild(editBtn);
    movieCard.appendChild(deleteBtn);

    moviesContainer.appendChild(movieCard);
  });
}

async function getCategories() {
  const response = await fetch(API_CATEGORIES);
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

addMovieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newMovie = {
    title: document.getElementById("title").value,
    year: Number(document.getElementById("year").value),
    rating: Number(document.getElementById("rating").value),
    image: document.getElementById("image").value,
    categoryId: Number(categorySelect.value),
  };

  await addMovie(newMovie);
});

async function addMovie(newMovie) {
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

    const data = await response.json();
    console.log(data);

    addMovieForm.reset();
    message.textContent = "Filmen lades till.";
    await getMovies();
  } catch (error) {
    console.log(error);
    message.textContent = error.message;
  }
}

async function deleteMovie(id) {
  try {
    const response = await fetch(`${API_MOVIES}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Kunde inte ta bort filmen.");
    }

    message.textContent = "Filmen togs bort.";
    await getMovies();
  } catch (error) {
    message.textContent = error.message;
  }
}

async function editMovieRating(movie) {
  const newRating = Number(prompt("Ange nytt betyg mellan 1 och 5:"));

  if (!newRating || newRating < 1 || newRating > 5) {
    message.textContent = "Betyget måste vara mellan 1 och 5.";
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

    message.textContent = "Betyget uppdaterades.";
    await getMovies();
  } catch (error) {
    message.textContent = error.message;
  }
}