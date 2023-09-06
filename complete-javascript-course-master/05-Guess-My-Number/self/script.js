"use strict";

// To get a range of random values, multiply random function output with max desired value.
// The result will be between 0 and the max number - 1.
// So, add 1 to it.

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
document.querySelector(".score").textContent = score;
document.querySelector(".highscore").textContent = highscore;

function updateHighscore(currentScore) {
  if (currentScore > highscore) {
    highscore = currentScore;
  }
  document.querySelector(".highscore").textContent = highscore;
}

// Check button
document.querySelector(".check").addEventListener("click", () => {
  const enteredNumber = Number(document.querySelector(".guess").value);
  let message;

  if (!enteredNumber) {
    message = "😪 Please enter a number...";
  } else if (enteredNumber > 20 || enteredNumber < 1) {
    message = "🤯 Enter a value between 1 and 20...";
  } else if (enteredNumber > secretNumber) {
    message = "📈 Too High...";
    score--;
  } else if (enteredNumber < secretNumber) {
    message = "📉 Too Low...";
    score--;
  } else {
    message = "🎉 You Won...";
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").textContent = secretNumber;
    updateHighscore(score);
  }

  if (score <= 0) {
    score = 0;
    message = "😕 You Lost...";
    document.querySelector("body").style.backgroundColor = "#f03e3e";
  }

  document.querySelector(".message").textContent = message;
  document.querySelector(".score").textContent = score;
});

// Again button
document.querySelector(".again").addEventListener("click", () => {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector("body").style.backgroundColor = "#222";
  score = 20;
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".message").textContent = "Start Guessing...";
  document.querySelector(".guess").value = "";
});
