const videoElement = document.querySelector("#video");
const btnContainer = document.querySelector(".btn-container");
const btn = document.querySelector("#button");

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

selectMediaStream();

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
