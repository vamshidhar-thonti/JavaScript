const videoElement = document.querySelector("#video");
const btnContainer = document.querySelector(".btn-container");
const btn = document.querySelector("#button");
const overlay = document.querySelector(".overlay");
const mobileMessage = document.querySelector(".mobile-message");

/* Storing user's device details in a variable*/
let details = navigator.userAgent;

/* Creating a regular expression
containing some mobile devices keywords
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details
it returns boolean value*/
let isMobileDevice = regexp.test(details);

// Prompt to select a media stream, pass to video element, then play
const selectMediaStream = async function () {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    videoElement.srcObject = mediaStream;

    videoElement.onloadedmetadata = async () => {
      videoElement.play();
    };
  } catch (error) {
    alert(error.message);
  }
};

if (isMobileDevice) {
  overlay.classList.remove("hidden");
  mobileMessage.classList.remove("hidden");
} else {
  overlay.classList.add("hidden");
  mobileMessage.classList.add("hidden");
  selectMediaStream();
}

btn.addEventListener("click", async () => {
  btn.disabled = true;

  videoElement.requestPictureInPicture();

  btn.disabled = false;
});

// const selectMediaStream = async function () {
//   try {
//     const mediaStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//     });
//     videoElement.srcObject = mediaStream;

//     videoElement.onloadedmetadata = async () => {
//       videoElement.play();

//       if (!document.pictureInPictureElement) {
//         // Start PIP
//         btn.textContent = "Stop";
//         await videoElement.requestPictureInPicture();
//       } else {
//         btn.textContent = "Start";
//         document.exitPictureInPicture();
//       }
//     };
//   } catch (error) {
//     alert(error.message);
//   }
// };
// btn.addEventListener("click", selectMediaStream);

// selectMediaStream();
