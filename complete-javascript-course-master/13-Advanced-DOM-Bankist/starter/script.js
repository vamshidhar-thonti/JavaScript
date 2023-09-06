'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// New way
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Old way
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling
btnScrollTo.addEventListener('click', event => {
  const section1CoOrds = section1.getBoundingClientRect();

  console.log(section1CoOrds);
  console.log(event.target.getBoundingClientRect()); // Button Co-ordinates

  // Scroll info
  console.log(window.pageXOffset, window.pageYOffset);

  // Viewport info
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Old way of Scrolling
  // window.scrollTo(
  //   section1CoOrds.left + window.pageXOffset, // Scroll in X axis
  //   section1CoOrds.top + window.pageYOffset // Scroll in Y axis. relative height from the current viewport + amount scroll happened on Y-axis
  // );

  // With Smooth Scrolling
  // window.scrollTo({
  //   left: section1CoOrds.left + window.pageXOffset,
  //   top: section1CoOrds.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New way of Smooth Scrolling
  section1.scrollIntoView({ behavior: 'smooth' }); // JS takes care of all the dimensions and calculations
});

///////////////////////////
// Page Navigation
///////////////////////////

// In efficient way
// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (event) {
//     const id = this.getAttribute('href');
//     event.preventDefault();
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// Efficient way
// 1. Attach event listener to the parent element of a group elements
// 2. Determine what element orginated the element

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////
// Tabbed Component
///////////////////////////

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Gaurd clause
  if (!clicked) return;

  const tabNumber = clicked.dataset.tab;

  // Remove the active classNames from all the tab buttons first and then add to the desired tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Remove the active classNames from all the contents first and then add to the desired content
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${tabNumber}`)
    .classList.add('operations__content--active');
});

///////////////////////////
// Menu Fade Animation
///////////////////////////

const handleHover = function (e) {
  // console.log(e, this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const nav = document.querySelector('.nav');
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5)
// });

// Here 0.5 will become this keyword in handleHover and the event will be acutomatically passed as an argument.
// For a handler function like below we can only pass one parameter which will be the event parameter, apart from that nothing else can be passed except the this keyword.
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////
// Sticky Navigation
///////////////////////////

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // entries is a list, even if only one threshold is given
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

///////////////////////////
// Reveal Sections
///////////////////////////

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

///////////////////////////
// Lazy Load images
///////////////////////////

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace low quality image with high quality image
  entry.target.src = entry.target.dataset.src;

  // Listening for load event and once loading is done then removing the blur css class from the respective image.
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  // Remove the observer once the flow is done.
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(image => imgObserver.observe(image));

///////////////////////////
// Slider Component
///////////////////////////

const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
let numOfSlides = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.scale = 0.5;
// slider.style.overflow = 'visible';

// const makeDotActive = function(index) {

// }

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activeDot(0);

const goToSlide = function (slidePosition) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translate(${(i - slidePosition) * 100}%)`;
  });
};
goToSlide(0);

const nextSlide = () => {
  if (currentSlide === numOfSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activeDot(currentSlide);
};

const previousSlide = () => {
  if (currentSlide === 0) {
    currentSlide = numOfSlides - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activeDot(currentSlide);
};

sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', previousSlide);

// Slide when arrow keys pressed
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', event => {
  if (event.target.classList.contains('dots__dot')) {
    const clickedIndex = event.target.dataset.slide;
    // console.log(clickedIndex);
    if (!clickedIndex) return;

    goToSlide(clickedIndex);
    activeDot(clickedIndex);
  }
});

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////////////      EXPERIMENTATION       //////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// Event Propagation practice
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (event) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', event.target, event.currentTarget);
//   console.log(event.currentTarget === this);

//   // Stop propagation
//   event.stopPropagation(); // Stops from bubbling to the parent elements
// });

// document.querySelector('.nav__links').addEventListener('click', function (event) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONATINER', event.target, event.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (event) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', event.target, event.currentTarget);
// });
