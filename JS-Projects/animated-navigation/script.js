const menuBars = document.querySelector(".menu-bars");
const overlay = document.querySelector(".overlay");
const nav1 = document.querySelector("#nav-1");
const nav2 = document.querySelector("#nav-2");
const nav3 = document.querySelector("#nav-3");
const nav4 = document.querySelector("#nav-4");
const nav5 = document.querySelector("#nav-5");

const animate = function (type) {
  const navElements = [nav1, nav2, nav3, nav4, nav5];
  const remove = type === "in" ? "out" : "in";
  const add = type === "in" ? "in" : "out";

  navElements.forEach((element, index) =>
    element.classList.remove(`slide-${remove}-${index + 1}`)
  );
  navElements.forEach((element, index) =>
    element.classList.add(`slide-${add}-${index + 1}`)
  );
};

const toggleMenuButton = function () {
  menuBars.classList.toggle("change");
  overlay.classList.toggle("overlay-active");
  if (overlay.classList.contains("overlay-active")) {
    overlay.classList.replace("overlay-slide-left", "overlay-slide-right");
    animate("in");
  } else {
    overlay.classList.replace("overlay-slide-right", "overlay-slide-left");
    animate("out");
  }
};

[menuBars, nav1, nav2, nav3, nav4, nav5].forEach((element) =>
  element.addEventListener("click", toggleMenuButton)
);
