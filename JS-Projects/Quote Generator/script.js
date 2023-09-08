"strict mode";

const quoteContainer = document.querySelector(".quote-container");
const btnTwitter = document.querySelector(".twitter-button");
const btnNewQuote = document.querySelector("#new-quote");
const quoteField = document.querySelector("#quote");
const authorField = document.querySelector("#author");
const loader = document.querySelector(".loader");

let data = [];

const loading = function () {
  loader.hidden = false;
  quoteContainer.hidden = true;
};

const complete = function () {
  quoteContainer.hidden = false;
  loader.hidden = true;
};

const getQuotes = async function () {
  try {
    loading();
    const apiURL =
      "https://jacintodesign.github.io/quotes-api/data/quotes.json";
    const result = await fetch(apiURL);
    data = await result.json();

    if (!data) throw new Error("Unable to fetch quotes");

    renderRandomQuote();
  } catch (error) {
    alert(`${error.message}. Please try again!!`);
  }
};

const renderRandomQuote = function () {
  loading();

  const randomNumber = Math.trunc(Math.random() * data.length);
  const { author, text } = data[randomNumber];

  // Decrease font size for a long quote
  if (text.length > 50) quoteField.classList.add("long-quote");
  else quoteField.classList.remove("long-quote");

  // Ṛender texts
  quoteField.textContent = text;
  authorField.textContent = author ?? "Anonymous";
  complete();
};

const tweetQuote = function () {
  const twitterURL = `https://twitter.com/intent/tweet?text=${quoteField.textContent} - ${authorField.textContent}`;
  window.open(twitterURL, "_blank");
};

btnNewQuote.addEventListener("click", renderRandomQuote);
btnTwitter.addEventListener("click", tweetQuote);

getQuotes();
