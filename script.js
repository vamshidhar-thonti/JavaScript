"use strict";

const projectCardsContainer = document.querySelector(".section-project-cards");
const heroText = document.querySelector(".hero-text");

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
  {
    link: "./JS-Projects/animated-template/",
    icon: '<i class="icon fa-solid fa-toolbox"></i>',
    title: "Animated Template",
    description: `It's just a bunch of good looking website templates ready to tweak and deploy with responsive designs included. Using a 3<sup>rd</sup> Party Library called <strong>A</strong>nimate <strong>O</strong>n <strong>S</strong>croll, implementing animation effects is very easy.`,
  },
  {
    link: "./JS-Projects/animated-navigation/",
    icon: '<i class="icon fa-solid fa-bars-progress"></i>',
    title: "Animated Navigation",
    description: `Demonstration of animating the menu navigation with hamburger styled button. Upon clicking it, the menu options smoothly slide-in and upon re-clicking it, the options slide-out.`,
  },
  {
    link: "./JS-Projects/music-player/",
    icon: '<i class="icon fa-solid fa-music"></i>',
    title: "Music Player",
    description: `Fun project of implementing a custom music player using JavaScript. The in-built music player is hidden and its controls will be controlled through code. Modern look with responsive design.`,
  },
  {
    link: "./JS-Projects/custom-countdown/",
    icon: '<i class="icon fa-regular fa-hourglass-half"></i>',
    title: "Custom Countdown",
    description: `A countdown timer which starts counting to the target date. Using browser's local storage, even on browser refresh, the count down resumes to the same target date.`,
  },
  {
    link: "./JS-Projects/bookmarks-app/",
    icon: '<i class="icon fa-solid fa-book-bookmark"></i>',
    title: "Bookmarks App",
    description: `A simple Bookmarks Web Application which takes URLs from the user and stores it on browser's storage. So, even on browser refresh the bookmarks exist.`,
  },
  {
    link: "./JS-Projects/video-player/",
    icon: '<i class="icon fa-solid fa-film"></i>',
    title: "Video Player",
    description: `A Custom Video Player with all the important controls like Volume control, Progress seeking, Play/Pause, Playback Speed, Mute/Unmute, Fullscreen Mode. Everything built from scratch.`,
  },
  {
    link: "./JS-Projects/form-validator/",
    icon: '<i class="icon fa-brands fa-wpforms"></i>',
    title: "Form Validation",
    description: `A simple demonstration of how to validate form's field data using some in-built HTML properties and also using Javascript.`,
  },
];

heroText.textContent = `JavaScript - ${String(linkObjects.length).padStart(
  2,
  "0"
)} Web Projects`;

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
