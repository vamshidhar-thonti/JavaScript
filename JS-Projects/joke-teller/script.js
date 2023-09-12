// TTS Free API - https://www.voicerss.org/sdk/javascript.aspx
// RAPID API (Free API hub) - https://rapidapi.com/voicerss/api/text-to-speech-1

const button = document.querySelector("#button");
const audioElement = document.querySelector("#audio");

const JOKES_URL =
  "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const TTS_API_KEY = "affa508d03424f139f53413938a55798";

// Toggle button state between enable/disable
const toggleButton = function () {
  button.disabled = !button.disabled;
};

const getJoke = async function () {
  try {
    let joke = "";
    const response = await fetch(JOKES_URL);
    const data = await response.json();

    if (data.setup) {
      joke = `${data.setup} ... ${data.delivery}`;
    } else {
      joke = data.joke;
    }

    convertTextToSpeech(joke);
  } catch (error) {
    alert(error.message);
  }
};

const convertTextToSpeech = async function (joke) {
  toggleButton();
  VoiceRSS.speech({
    key: "affa508d03424f139f53413938a55798",
    src: joke,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
};

button.addEventListener("click", getJoke);
audioElement.addEventListener("ended", toggleButton);
