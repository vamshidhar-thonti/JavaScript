"strict-mode";

const imageContainer = document.querySelector(".image-container");
const loader = document.querySelector(".loader");

// Unsplash API
let imageCountToLoad = 5;
const ACCESS_KEY = "YU69soUJSAXGtTEowKiEpq7tV0J8lEMRSGnHtafsAe8";

let initialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

const getUnsplashApiUrl = (count) =>
  `https://api.unsplash.com/photos/random/?client_id=${ACCESS_KEY}&count=${count}`;

const imageLoaded = function () {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
};

const setAttributes = function (element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
};

const displayPhotos = function () {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  photosArray.forEach((photo) => {
    const anchor = document.createElement("a");
    setAttributes(anchor, {
      href: photo.links.html,
      target: "_blank",
    });

    const image = document.createElement("img");
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Listens to load event on each image and then triggers imageLoaded function
    image.addEventListener("load", imageLoaded);

    // Adding anchor and images into imageContainer
    anchor.appendChild(image);
    imageContainer.appendChild(anchor);
  });
};

const getPhotos = async function () {
  try {
    if (initialLoad) {
      initialLoad = false;
    } else {
      imageCountToLoad = 30;
    }
    const response = await fetch(getUnsplashApiUrl(imageCountToLoad));
    photosArray = await response.json();

    displayPhotos();
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};

// Load more photos after scrolling near to the bottom
// window.innerHeight -> Height of the existing view in px
// window.scrollY -> amount of scrolling happened in px
// document.body.offsetHeight -> total height of the body including both in the view and out of the view
// We subtract 1000 to create a threshold to trigger the function
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
