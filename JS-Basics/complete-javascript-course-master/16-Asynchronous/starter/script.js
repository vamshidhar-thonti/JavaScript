'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const images = document.querySelector('.images');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.continents[0]}</h4>
      <p class="country__row"><span>👫</span>${(
        data.population / 10000000
      ).toFixed(1)} Cr Population</p>
      <p class="country__row"><span>🗣️</span>${
        data.languages[Object.keys(data.languages)[0]]
      }</p>
      <p class="country__row"><span>💰</span>${
        data.currencies[Object.keys(data.currencies)[0]].name
      }</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = url => {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error('Country not found!!');
    return response.json();
  });
};

///////////////////////////////////////
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();

//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const data = JSON.parse(this.responseText)[0];

//     const html = `
//     <article class="country">
//       <img class="country__img" src="${data.flags.png}" />
//       <div class="country__data">
//         <h3 class="country__name">${data.name.common}</h3>
//         <h4 class="country__region">${data.continents[0]}</h4>
//         <p class="country__row"><span>👫</span>${(
//           data.population / 10000000
//         ).toFixed(1)} Cr Population</p>
//         <p class="country__row"><span>🗣️</span>${
//           data.languages[Object.keys(data.languages)[0]]
//         }</p>
//         <p class="country__row"><span>💰</span>${
//           data.currencies[Object.keys(data.currencies)[0]].name
//         }</p>
//       </div>
//     </article>
//     `;
//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountryData('india');
// getCountryData('japan');
// getCountryData('sri lanka');

// Callback Hell

/*
const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText)[0];
    console.log(data);
    // Render country 1
    renderCountry(data);

    const borders = data.borders;
    borders.forEach(border => {
      const request2 = new XMLHttpRequest();

      request2.open('GET', `https://restcountries.com/v3.1/alpha/${border}`);
      request2.send();
      request2.addEventListener('load', function () {
        const data2 = JSON.parse(this.responseText)[0];
        renderCountry(data2, 'neighbour');
      });
    });
  });
};

getCountryAndNeighbour('india');
*/

// Promises
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`)
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) throw new Error('Neighbour not found!');

      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(error => {
      console.error(error);
      renderError(error.message);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  // whereAmI(52.508, 13.381);
  // whereAmI(19.037, 72.873);
  whereAmI(-33.933, 18.474);
  // getCountryData('australia');
});

// Coding challenge 1
const whereAmI = async function (lat, lng) {
  // fetch(
  //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}5&zoom=18&addressdetails=1`
  // )
  //   .then(response => {
  //     if (!response.ok) throw new Error('Invalid co-ordinates');
  //     return response.json();
  //   })
  //   .then(data => {
  //     if (Object.keys(data).includes('error')) throw new Error(data.error);
  //     console.log(`You are in ${data.address.city}, ${data.address.country}`);
  //     getCountryData(data.address.country);
  //   })
  //   .catch(error => console.log(error.message));
  try {
    const resGeo = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}5&zoom=18&addressdetails=1`
    );
    const data = await resGeo.json();

    console.log(data);
    if (Object.keys(data).includes('error')) throw new Error(data.error);
    getCountryData(data.address.country);

    return `You are in ${data.address.city}, ${data.address.country}`;
  } catch (error) {
    renderError(error.message);
    throw error;
  }
};

// Promise priority in practice
console.log('Test start');
setTimeout(() => console.log('Timer 1'), 0);
Promise.resolve('Promise 1').then(res => console.log(res));
Promise.resolve('Promise 2').then(res => {
  setTimeout(() => console.log('Timer 2'), 10);
  console.log(res);
});
console.log('Test end');

// Custom Promise
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You Won');
    } else {
      reject(new Error('You Lost'));
    }
  }, 2000);
});

lotteryPromise
  .then(res => console.log(res))
  .catch(err => console.error(err.message));

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// wait(5).then(() => console.log('5 seconds passed'));

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img');
    image.src = imgPath;

    image.addEventListener('load', () => {
      images.append(image);
      resolve(image);
    });

    image.addEventListener('error', () => {
      reject(new Error(`Image not found at ${imgPath}`));
    });
  });
};

let currentImg;
const loadAndWait = imageNumber => {
  return createImage(`.\\img\\img-${imageNumber}.jpg`).then(img => {
    currentImg = img;
    return wait(2);
  });
};

// Coding Challenge 3
const loadNPause = async () => {
  try {
    let img = await createImage(`.\\img\\img-1.jpg`);
    await wait(2);
    img.style.display = 'none';

    img = await createImage(`.\\img\\img-2.jpg`);
    await wait(2);
    img.style.display = 'none';
  } catch (err) {
    console.log(err.message);
  }
};

// loadNPause();

const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(img => createImage(img));
    console.log(imgs);
    const imgs2 = await Promise.all(imgs);
    imgs2.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.log(err.message);
  }
};

loadAll(['.\\img\\img-1.jpg', '.\\img\\img-2.jpg', '.\\img\\img-3.jpg']);

// loadNPause(1)
//   .then(() => {
//     currentImg.style.display = 'none';
//     return loadNPause(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   });

// loadAndWait(1)
//   .then(() => {
//     currentImg.style.display = 'none';
//     return loadAndWait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.log(err.message));

// whereAmI(33.933, 18.474)
//   .then(res => console.log(res))
//   .catch(err => console.log(err.message));

// Using IIFE
// As whereAmI returns promise we were using then() but using IIFE await can be leveraged as below
(async function () {
  try {
    const result = await whereAmI(-33.933, 18.474);
    console.log(result);
  } catch (error) {
    console.log(error.message);
  }
})();

const get3Countries = async function (c1, c2, c3) {
  try {
    // Below runs in sequence
    // const d1 = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const d2 = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const d3 = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    // console.log([d1[0].capital[0], d2[0].capital[0], d3[0].capital[0]]);

    // Below works in parallel, thus saves time, (RECOMMENDED)
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    console.log(data.map(d => d[0].capital[0]));
  } catch (err) {
    console.error(err);
  }
};

get3Countries('australia', 'nepal', 'sri lanka');

// Best use case of race() to check and terminate if a request takes too long
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request too long.'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/australia`),
  timeout(0.1),
])
  .then(res => console.log(res))
  .catch(err => console.error(err.message));
