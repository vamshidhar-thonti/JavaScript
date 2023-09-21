"use strict";

const btnAddBookmark = document.querySelector("#add-bookmark");
const bookmarkContainer = document.querySelector("#bookmark-container");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".close-modal");
const btnSubmit = document.querySelector(".submit");
const addBookmarkForm = document.querySelector(".add-bookmark-form");
const bookmarkName = document.querySelector("#bookmark-name");
const bookmarkURL = document.querySelector("#bookmark-url");

let btnDeleteBookmark;

let bookmarks = [];

// Get bookmarks
const getBookmarks = function () {
  const _bookmarks = JSON.parse(localStorage.getItem("bookmarks-app"));
  if (_bookmarks) {
    bookmarks = _bookmarks;
  }
  return bookmarks;
};

// Set to Local Storage
const setBookmarkLocal = function () {
  localStorage.setItem("bookmarks-app", JSON.stringify(bookmarks));
};

// Set bookmark
const setBookmark = function (bookmark) {
  bookmarks.push(bookmark);
  setBookmarkLocal();
  getBookmarks();
};

// Generate markup
const getMarkup = function (title, url) {
  return `
    <div class="inner-bookmark-container">
      <a class="bookmark" href="${url}" target="_blank" title="${title}">
        <img class="favicon" src="https://www.google.com/s2/u/0/favicons?domain=${url}" />
        <span>${title.length > 12 ? title.slice(0, 13) + "..." : title}</span>
      </a>
      <i class="close-icon fa-solid fa-xmark" data-title="${title}"></i>
    </div>
  `;
};

// Update Bookmarks on UI
const updateDOM = function () {
  if (!bookmarks) return;
  bookmarkContainer.innerHTML = "";
  bookmarks.forEach((bookmark) => {
    bookmarkContainer.insertAdjacentHTML(
      "beforeend",
      getMarkup(bookmark.title, bookmark.url)
    );
    btnDeleteBookmark = document.querySelectorAll(".close-icon");
    btnDeleteBookmark.forEach((icon) =>
      icon.addEventListener("click", deleteBookmark)
    );
  });
};

const validateUrl = function (value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
};

// Add a new bookmark
const addBookmark = function (event) {
  event.preventDefault();

  const title = event.srcElement[0].value;
  let url = event.srcElement[1].value.replace("https://", "");

  if (!url.includes("https://") && !url.includes("http://")) {
    url = `https://${url}`;
  }

  if (!validateUrl(url)) {
    alert("Please enter a valid URL!!");
    return;
  }

  setBookmark({ title: title, url: url });
  updateDOM();
  closeModal();
};

// Delete Bookmark
const deleteBookmark = function () {
  bookmarks = getBookmarks();
  const filtered = bookmarks.filter((bk) => bk.title !== this.dataset.title);
  bookmarks = filtered;
  setBookmarkLocal();
  updateDOM();
};

// Open Modal
const openModal = function () {
  overlay.hidden = false;
  modal.hidden = false;
};

// Close Modal
const closeModal = function () {
  overlay.hidden = true;
  modal.hidden = true;
  bookmarkName.value = "";
  bookmarkURL.value = "";
};

// Event Listeners
btnAddBookmark.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

addBookmarkForm.addEventListener("submit", addBookmark);

// On Load
if (getBookmarks()) {
  updateDOM();
}
