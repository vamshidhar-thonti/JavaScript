"use strict";

const searchForm = document.querySelector("#search-form");
const source = document.querySelector("#source");
const textInput = document.querySelector("#text-field");
const limitInput = document.querySelector("#limit-field");
const result = document.querySelector(".result");
const loading = document.querySelector(".loading");
const errorPopup = document.querySelector(".popup");
const errorContent = document.querySelector(".error-content");
const btnErrorClose = document.querySelector(".error-close-icon");

const RP_SEARCH_URL = "http://127.0.0.1:8000/api/v1/rose_petals_search/";
const RP_API_KEY = "DEFAULT_API_KEY";

let fetchedData = {};

const expandMessages = function (event) {
  event.preventDefault();
  const parent = event.target.closest(".output");
  const childMessageEl = parent.querySelector(".messages");

  childMessageEl.classList.toggle("hidden");
  this.classList.toggle("icon-rot-90");
};

const fetchRPData = async function (searchString, limit) {
  try {
    loading.classList.remove("hidden");
    const response = await fetch(
      `${RP_SEARCH_URL}?q=${searchString}&top_n=${limit}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": `${RP_API_KEY}`,
        },
      }
    );
    fetchedData = await response.json();
    if (!response.ok) {
      throw new Error(`${response.status}: ${fetchedData["detail"]}`);
    }

    displayData();
  } catch (error) {
    displayErrorPopup();
    console.log(error);
  } finally {
    loading.classList.add("hidden");
  }
};

const displayErrorPopup = function () {
  if (fetchedData.hasOwnProperty("detail")) {
    console.log(fetchedData);
    errorContent.textContent = fetchedData["detail"];
    errorPopup.classList.remove("hide-popup");
    setTimeout(hidePopup, 10 * 1000);
  }
};

const displayData = function () {
  result.innerHTML = "";
  for (const key in fetchedData) {
    if (fetchedData.hasOwnProperty(key)) {
      let messageDiv = "";
      for (let message of fetchedData[key]["contexts"]) {
        message = message
          .replaceAll("\n", " ")
          .replaceAll("GURUJI", "<br /><strong>GURUJI</strong>")
          .replaceAll("DEVOTEE", "<br /><strong>DEVOTEE</strong>");
        message = message.replace(
          "<br /><strong>DEVOTEE</strong>",
          "<strong>DEVOTEE</strong>"
        );
        messageDiv += `
        <div class="message">
          ${message}
        </div>
        `;
      }
      const parentDiv = `
        <div class="output" id="output">
          <div class="parent">
            <div class="source" id="source">
              <strong>${key}</strong>
              <div class="parent-center">
                <a href="${fetchedData[key]["sources"]["english_link"]}" class="english-link" id="english-link" target="_blank">
                English Article Link
                </a>
                <a href="${fetchedData[key]["sources"]["telugu_link"]}" class="telugu-link" id="telugu-link" target="_blank">
                Telugu Article Link
                </a>
              </div>
            </div>
            <i class="icon fa-regular fa-circle-xmark"></i>
          </div>
          <div class="messages hidden" id="messages">
            ${messageDiv}
          </div>
        </div>
      `;
      result.insertAdjacentHTML("beforeend", parentDiv);

      const btnExpand = document.querySelectorAll(".icon");
      btnExpand.forEach((btn) => {
        btn.addEventListener("click", expandMessages);
      });
    }
  }
};

const submitForm = function (event) {
  event.preventDefault();

  if (textInput.value) {
    fetchRPData(textInput.value, limitInput.value);
  }
};

const hidePopup = function () {
  errorPopup.classList.add("hide-popup");
};

searchForm.addEventListener("submit", submitForm);
btnErrorClose.addEventListener("click", hidePopup);
