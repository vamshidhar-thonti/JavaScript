"use strict";

const form = document.querySelector("#form");
const password1El = document.querySelector("#password1");
const password2El = document.querySelector("#password2");
const messageContainer = document.querySelector(".message-container");
const message = document.querySelector("#message");

let isValid = false;
let passwordsMatch = false;

const validateForm = function () {
  // Using Constraint API
  isValid = form.checkValidity();

  // Style a message for an error
  if (!isValid) {
    message.textContent = "Please fill out all fields.";
    message.style.color = "red";
    messageContainer.style.borderColor = "red";
    return;
  }

  // Check to see if passwords match
  if (password1El.value === password2El.value) {
    passwordsMatch = true;
    password1El.style.borderColor = "green";
    password2El.style.borderColor = "green";
  } else {
    passwordsMatch = false;
    message.textContent = "Make sure passwords match!";
    password1El.style.borderColor = "red";
    password2El.style.borderColor = "red";
    message.style.color = "red";
    messageContainer.style.borderColor = "red";
    return;
  }

  // If Form is valid and passwords match
  if (isValid && passwordsMatch) {
    message.textContent = "Successfully Registered!";
    message.style.color = "green";
    messageContainer.style.borderColor = "green";
  }
};

const storeFormData = function () {
  const user = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    website: form.website.value,
    password: form.password.value,
  };

  // Do something with the data
  console.log(user);
};

const processFormData = function (event) {
  event.preventDefault();

  validateForm();

  // Submit only if valid
  if (isValid && passwordsMatch) storeFormData();
};

// Event Listeners
form.addEventListener("submit", processFormData);
