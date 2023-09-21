const inputContainer = document.querySelector("#input-container");
const countdownForm = document.querySelector("#countdownForm");
const dateEl = document.querySelector("#date-picker");
const countdownEl = document.querySelector("#countdown");
const countdownElTitle = document.querySelector("#countdown-title");
const btnCountdown = document.querySelector("#countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.querySelector("#complete");
const completeElInfo = document.querySelector("#complete-info");
const btnComplete = document.querySelector("#complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Populate countdown
const updateDOM = function () {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input container
    inputContainer.hidden = true;

    // If countdown ended, show completed
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Else, show the countdown in progress
      // Populating countdown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      // Show countdown
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
};

const updateCountdown = function (event) {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // Check for valid date
  if (countdownDate === "") {
    alert("Please select a date.");
  } else {
    // Get number version of current date
    countdownValue = new Date(countdownDate).getTime(); // Epoch format

    updateDOM();
  }
};

// Reset all values
const reset = function () {
  // Hide Countdowns, show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  // Stop countdown
  clearInterval(countdownActive);

  // Reset values
  countdownTitle = "";
  countdownDate = "";
  countdownEl.textContent = countdownDate;
  countdownElTitle.textContent = countdownElTitle;

  // Clean local storage
  localStorage.removeItem("countdown");
};

const restorePreviousCountdown = function () {
  let savedData = localStorage.getItem("countdown");
  if (savedData) {
    inputContainer.hidden = true;
    savedData = JSON.parse(savedData);
    countdownTitle = savedData.title;
    countdownDate = savedData.date;
    countdownValue = new Date(countdownDate).getTime(); // Epoch format
    updateDOM();
  }
};

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
btnCountdown.addEventListener("click", reset);
btnComplete.addEventListener("click", reset);

// On Load, check local storage
restorePreviousCountdown();
