const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const btnPlay = document.querySelector("#play-button");
const btnVolume = document.querySelector("#volume-icon");
const volumeBar = document.querySelector(".volume-bar");
const volumeRange = document.querySelector(".volume-range");
const playerSpeed = document.querySelector("#player-speed");
const btnFullscreen = document.querySelector(".fullscreen");
const fullscreenIcon = document.querySelector(".fullscreen-icon");
const timeElapsed = document.querySelector(".time-elapsed");
const timeDuration = document.querySelector(".time-duration");

let lastVolume = 0.7;

// Play & Pause ----------------------------------- //
const showPlayIcon = function () {
  btnPlay.classList.replace("fa-pause", "fa-play");
  btnPlay.setAttribute("title", "Play");
};

const playOrPauseVideo = function (event) {
  event.preventDefault();
  if (video.paused) {
    btnPlay.classList.replace("fa-play", "fa-pause");
    btnPlay.setAttribute("title", "Pause");
    video.play();
  } else {
    video.pause();
    showPlayIcon();
  }
};

// Progress Bar ---------------------------------- //
const updateProgressBar = function (event) {
  btnFullscreen.setAttribute("title", "Fullscreen");
  const { currentTime, duration } = event.srcElement;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);

  const totalMinutes = Math.floor(duration / 60);
  const totalSeconds = Math.floor(duration % 60);

  const progressPercentage = (currentTime / duration) * 100;

  progressBar.style.width = `${progressPercentage}%`;
  timeElapsed.textContent = `${currentMinutes}:${String(
    currentSeconds
  ).padStart(2, "0")} / `;
  timeDuration.textContent = `${totalMinutes}:${String(totalSeconds).padStart(
    2,
    "0"
  )}`;
};

const setProgressBar = function (event) {
  const progressWidth = this.clientWidth;
  const customWidth = event.offsetX;

  const { duration } = video;

  const calculatedPercentage = (customWidth / progressWidth) * 100;
  const calculatedTime = (customWidth / progressWidth) * duration;

  progressBar.style.width = `${calculatedPercentage}%`;
  video.currentTime = calculatedTime;
};

// Volume Controls --------------------------- //
const toggleMute = function (event) {
  event.preventDefault();
  btnVolume.className = "";
  if (video.muted) {
    video.muted = false;
    btnVolume.classList.add("fas", "fa-solid", "fa-volume-high");
    volumeBar.style.width = `${lastVolume * 100}%`;
    btnVolume.setAttribute("title", "Mute");
  } else {
    video.muted = true;
    btnVolume.classList.add("fas", "fa-solid", "fa-volume-xmark");
    volumeBar.style.width = `${0}%`;
    btnVolume.setAttribute("title", "Unmute");
  }
};

const changeVolume = function (event) {
  let volume = event.offsetX / volumeRange.offsetWidth;
  if (volume < 0.1) volume = 0;
  if (volume > 0.9) volume = 1;
  lastVolume = volume;
  video.volume = volume;
  volumeBar.style.width = `${volume * 100}%`;

  btnVolume.className = "";
  if (volume > 0.7) {
    btnVolume.classList.add("fas", "fa-solid", "fa-volume-high");
  } else if (volume < 0.7 && volume > 0) {
    btnVolume.classList.add("fas", "fa-solid", "fa-volume-low");
  } else {
    btnVolume.classList.add("fas", "fa-solid", "fa-volume-off");
  }
};

// Change Playback Speed -------------------- //
const changePlaybackRate = function (event) {
  event.preventDefault();
  video.playbackRate = playerSpeed.value;
};

// Fullscreen ------------------------------- //
/* View in fullscreen */
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
  video.classList.add("video-fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
  video.classList.remove("video-fullscreen");
}

let fullscreenFlag = false;

const fullscreenVideo = function (event) {
  event.preventDefault();
  if (!fullscreenFlag) {
    fullscreenFlag = true;
    openFullscreen(player);
    fullscreenIcon.classList.replace("fa-expand", "fa-compress");
    btnFullscreen.setAttribute("title", "Exit Fullscreen");
  } else {
    fullscreenFlag = false;
    closeFullscreen();
    fullscreenIcon.classList.replace("fa-compress", "fa-expand");
    btnFullscreen.setAttribute("title", "Fullscreen");
  }
};

// Even Listeners
btnPlay.addEventListener("click", playOrPauseVideo);
video.addEventListener("ended", showPlayIcon);
video.addEventListener("click", playOrPauseVideo);
playerSpeed.addEventListener("click", changePlaybackRate);
btnFullscreen.addEventListener("click", fullscreenVideo);
video.addEventListener("timeupdate", updateProgressBar);
video.addEventListener("canplay", updateProgressBar);
progressRange.addEventListener("click", setProgressBar);
btnVolume.addEventListener("click", toggleMute);
volumeRange.addEventListener("click", changeVolume);
