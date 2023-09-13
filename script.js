"use strict";

const projectCardsContainer = document.querySelector(".section-project-cards");

const linkObjects = [
  {
    link: "./JS-Projects/quote-generator/",
    icon: '<i class="icon fa-solid fa-quote-left"></i>',
    title: "Quote Generator",
    description: `Leveraged the free public APIs to fetch a random quote
    asynchronously for every 'click' event. Twitter button copies
    the Quote and prompts a tweet ready post on it's platform.`,
  },
  {
    link: "./JS-Projects/infinite-scroll/",
    icon: '<i class="icon fa-solid fa-infinity"></i>',
    title: "Infinite Scroll",
    description: `With Unsplash's API, fetches good quality images dynamically.
    Images load automatically when the scroll almost reaches the
    last image. It's a clone of instagram's infinity posts scroll.`,
  },
  {
    link: "./JS-Projects/picture-in-picture/",
    icon: '<i class="icon fa-regular fa-images"></i>',
    title: "Picture In Picture",
    description: `View any screen/application in "Picture In Picture" mode which
    gets displayed on top of all screens.`,
  },
  {
    link: "./JS-Projects/joke-teller/",
    icon: '<i class="icon fa-regular fa-face-laugh-squint"></i>',
    title: "Joke Teller",
    description: `Using public APIs, fetches a random joke, converts it into
    Speech using a free text to speech API service and then reads
    out the joke every time the button is clicked.`,
  },
  {
    link: "./JS-Projects/light-dark-mode/",
    icon: '<i class="icon fa-solid fa-circle-half-stroke"></i>',
    title: "Light-Dark Mode",
    description: `Toggling between Light and Dark Mode themes with just CSS and plain Javascript. Using a set of colors for both themes as variables in CSS and then toggling those brings the theme change effect.`,
  },
];

const generateMarkup = function (object, index) {
  return `
    <a class="project-card" href=${object.link}>
      <div class="project">
        ${index % 2 === 0 ? "" : object.icon}
        <div class="content-block">
          <span class="title">${object.title}</span>
          <span class="description">${object.description}</span>
        </div>
        ${index % 2 === 0 ? object.icon : ""}
      </div>
    </a>
  `;
};

linkObjects.forEach((object, index) => {
  projectCardsContainer.insertAdjacentHTML(
    "beforeend",
    generateMarkup(object, index + 1)
  );
});
