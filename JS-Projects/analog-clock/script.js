"use strict";

const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");

const updateHands = function () {
  const now = new Date();

  const ms = now.getMilliseconds();
  const ss = now.getSeconds();
  const mm = now.getMinutes();
  const hh = now.getHours();

  const degrees = 360;
  const half = degrees / 2;

  const totalHours = 24;
  const totalSecondsOrMinutes = 60;
  const totalMilliseconds = 1000;

  const hour = ((hh + mm / totalSecondsOrMinutes) / totalHours) * half;
  const minute =
    ((mm + ss / totalSecondsOrMinutes) / totalSecondsOrMinutes) * degrees;
  const second =
    ((ss + ms / totalMilliseconds) / totalSecondsOrMinutes) * degrees;

  hours.style.transform = `rotateZ(${hour}deg)`;
  minutes.style.transform = `rotateZ(${minute}deg)`;
  seconds.style.transform = `rotateZ(${second}deg)`;
};

setInterval(updateHands, 1);
