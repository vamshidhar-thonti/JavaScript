const resultsNav = document.querySelector("#resultsNav");
const favoritesNav = document.querySelector("#favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const btnFavorites = document.querySelector(".favorites-button");

// NASA API

const count = 10;
const DEMO_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${DEMO_KEY}&count=${count}`;

let resultsArray = [];
let favorites = {};

const generateMarkup = function (data, deleteFlag) {
  const markup = `
    <div class="card">
      <a href="${data.hdurl}" title="View Full Page" target="_blank">
        <img
          src="${data.url}"
          alt="NASA Picture of the day"
          class="card-img-top"
        />
      </a>
      <div class="card-body">
        <h5 class="card-title">${data.title}</h5>
        <p class="clickable" 
        onclick="modifyFavorite('${data.url}')">
          ${deleteFlag !== "" ? "Remove Favroite" : "Add to Favorites"}
        </p>
        <p class="card-text">
          ${data.explanation}
        </p>
        <small class="text-muted">
          <strong>${data.date}</strong>
          <span>${data.copyright ?? ""}</span>
        </small>
      </div>
    </div>
  `;
  return markup;
};

const updateDOM = function (apodObjects, deleteFlag = "") {
  imagesContainer.innerHTML = "";
  apodObjects.forEach((result) => {
    imagesContainer.insertAdjacentHTML(
      "beforeend",
      generateMarkup(result, deleteFlag)
    );
  });
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  loader.classList.add("hidden");
};

const renderFavorites = function () {
  if (localStorage.getItem("nasaFavorites")) {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
    updateDOM(
      Object.values(JSON.parse(localStorage.getItem("nasaFavorites"))),
      "deleteText"
    );
  }
};

// Get 10 Images from NASA API

const getNasaPictures = async function () {
  try {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
    loader.classList.remove("hidden");
    const response = await fetch(API_URL);
    resultsArray = await response.json();
    updateDOM(resultsArray);
  } catch (error) {
    console.log(error.message);
  }
};

// Save a favorite
const modifyFavorite = function (url) {
  if (!favoritesNav.classList.contains("hidden")) {
    delete favorites[url];
    // Put into local storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    renderFavorites();
  } else {
    resultsArray.forEach((result) => {
      if (result.url.includes(url) && !favorites[url]) {
        favorites[url] = result;

        // Added Confirmation pop up message
        saveConfirmed.classList.remove("hidden");
        setTimeout(function () {
          saveConfirmed.classList.add("hidden");
        }, 2000);

        // Put into local storage
        localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
      }
    });
  }
};

// Event Listeners
btnFavorites.addEventListener("click", renderFavorites);
// favoritesNav.addEventListener("click", renderMainPage);

// On Load
getNasaPictures();
