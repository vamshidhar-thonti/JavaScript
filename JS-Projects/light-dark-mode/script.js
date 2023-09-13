"use strict";

const toggleSwitch = document.querySelector('input[type="checkbox"]');
const nav = document.querySelector("nav");
const toggleIcon = document.querySelector("#toggle-icon");
const image1 = document.querySelector("#image1");
const image2 = document.querySelector("#image2");
const image3 = document.querySelector("#image3");
const textBox = document.querySelector("#text-box");

const DARK_THEME = "dark";
const LIGHT_THEME = "light";

const theme = function (mode) {
  const darkBg = "rgb(0 0 0 / 50%)";
  const lightBg = "rgb(255 255 255 / 50%)";
  const darkIcon = "fa-moon";
  const lightIcon = "fa-sun";

  toggleSwitch.checked = mode === DARK_THEME ? true : false;

  nav.style.backgroundColor = `${mode === DARK_THEME ? darkBg : lightBg}`;
  textBox.style.backgroundColor = `${mode === DARK_THEME ? lightBg : darkBg}`;
  toggleIcon.children[0].textContent = `${
    mode.slice(0, 1).toUpperCase() + mode.slice(1)
  } Mode`;
  toggleIcon.children[1].classList.remove(
    `${mode === DARK_THEME ? lightIcon : darkIcon}`
  );
  toggleIcon.children[1].classList.add(
    `${mode === DARK_THEME ? darkIcon : lightIcon}`
  );
  image1.src = `img/undraw_proud_coder_${mode}.svg`;
  image2.src = `img/undraw_feeling_proud_${mode}.svg`;
  image3.src = `img/undraw_conceptual_idea_${mode}.svg`;
};

// Switch theme
const switchTheme = function (event) {
  let mode;
  if (event.target.checked) {
    mode = DARK_THEME;
  } else {
    mode = LIGHT_THEME;
  }
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  theme(mode);
};

// Slider Event Listener
toggleSwitch.addEventListener("change", switchTheme);

// Check Local Storage for theme
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  theme(currentTheme);
}
