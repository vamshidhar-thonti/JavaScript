const music = document.querySelector("audio");
const image = document.querySelector("img");

const progressContainer = document.querySelector("#progress-container");
const progress = document.querySelector("#progress");
const currentTimeEl = document.querySelector("#current-time");
const durationEl = document.querySelector("#duration");

const title = document.querySelector(".title");
const artist = document.querySelector("#artist");

const btnPrev = document.querySelector("#prev");
const btnPlay = document.querySelector("#play");
const btnNext = document.querySelector("#next");

const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jacinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jacinto Design",
  },
  {
    name: "metric-1",
    displayName: "Front Row (Remix)",
    artist: "Jacinto Design",
  },
];

// Check if playing
let isPlaying = false;

// Set initial song
let currentSong = 0;

const playPauseAudio = function () {
  isPlaying = !isPlaying;

  if (isPlaying) {
    btnPlay.classList.replace("fa-play", "fa-pause");
    music.play();
  } else {
    btnPlay.classList.replace("fa-pause", "fa-play");
    music.pause();
  }
};

// Update DOM
const loadSong = function (song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
};

const playNextOrPrevSong = function (action) {
  action === "next" ? currentSong++ : currentSong--;

  // Reset index
  if (currentSong >= songs.length || currentSong <= -songs.length)
    currentSong = 0;

  // at() support negative indexing
  loadSong(songs.at(currentSong));

  isPlaying ? music.play() : music.pause();
};

// Update progress bar and time
const updateProgressBar = function (event) {
  if (isPlaying) {
    const { currentTime, duration } = event.srcElement;
    const minutes = Math.trunc(currentTime / 60);
    const seconds = Math.trunc(currentTime % 60);

    const duratioMinutes = Math.trunc(duration / 60);
    const durationSeconds = Math.trunc(duration % 60);

    // Update Progress Bar Width
    const progressPercent = (currentTime / duration) * 100;

    progress.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = `${minutes}:${String(seconds).padStart(
      2,
      "0"
    )}`;
    if (durationSeconds)
      durationEl.textContent = `${duratioMinutes}:${String(
        durationSeconds
      ).padStart(2, "0")}`;
  }
};

// Set progress bar
const setProgressBar = function (event) {
  const ProgressWidth = this.clientWidth;
  const customWidth = event.offsetX;
  const { duration } = music;

  const calculatedPercentage = (customWidth / ProgressWidth) * 100;
  const calculatedTime = (customWidth / ProgressWidth) * duration;

  progress.style.width = `${calculatedPercentage}%`;
  music.currentTime = calculatedTime;
};

btnPrev.addEventListener("click", () => playNextOrPrevSong("prev"));
btnPlay.addEventListener("click", playPauseAudio);
btnNext.addEventListener("click", () => playNextOrPrevSong("next"));
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", () => playNextOrPrevSong("next"));
progressContainer.addEventListener("click", setProgressBar);

// On Load select first song
loadSong(songs.at(0));
