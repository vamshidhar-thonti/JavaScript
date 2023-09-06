'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.modal__overlay');
const btnModalYes = document.querySelector('.modal__yes');
const btnModalNo = document.querySelector('.modal__no');
const message = document.querySelector('.message__container');
const closeMessage = document.querySelector('.close__message');

class Workout {
  id = (Date.now() + '').slice(-10);
  date = new Date();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // prettier-ignore
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.type = 'running';
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevatioinGain) {
    super(coords, distance, duration);
    this.elevatioinGain = elevatioinGain;
    this.type = 'cycling';
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 15;
  #workouts = [];

  constructor() {
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkOut.bind(this));

    inputType.addEventListener('change', this._toggleElevationField); //.bind(this) is not needed here because that method is not using this method anywhere;

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    closeMessage.addEventListener('click', this._closeMessage);
  }

  _getPosition() {
    // Geo Location API JS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert('Location access denied!!');
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // 13 here is a zoom number. low number - zoom out, high number - zoom in

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords).addTo(map).bindPopup('My Home Town').openPopup();

    // map here belongs to leaflet not in built map
    // on method is similar to addEventListener
    // Just like event listener on method also gives a parameter which returns all the details of the location where click event happens on the map.
    this.#map.on('click', this._showForm.bind(this));

    // Render the markers from the local storage
    this.#workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapEvent) {
    this.#mapEvent = mapEvent;

    // Reveal workout form
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Hide form
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);

    // Set storage to all workouts
    this._setLocalStorage();
  }

  _toggleElevationField(event) {
    event.preventDefault();

    if (inputType.value === 'cycling') {
      inputElevation
        .closest('.form__row')
        .classList.remove('form__row--hidden');
      inputCadence.closest('.form__row').classList.add('form__row--hidden');
    } else {
      inputElevation.closest('.form__row').classList.add('form__row--hidden');
      inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    }

    // Different approach is to just toggle the hidden class as there are only 2 elements. No conditional statements needed.
    // inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    // inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkOut(event) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input) && input > 0);

    event.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout is running, creating running object
    if (type === 'running') {
      const cadence = Number(inputCadence.value);
      // Check if data is valid
      if (!validInputs(distance, duration, cadence)) {
        this._showMessage('Input has to be a positive number', 'error');
        setTimeout(this._closeMessage, 5000);
        return;
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, creating cycling object
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);

      if (!validInputs(distance, duration, elevation)) {
        this._showMessage('Input has to be a positive number', 'error');
        setTimeout(this._closeMessage, 5000);
        return;
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide the form + Clear fields
    this._hideForm();

    // Success Message
    this._showMessage('Added a New Workout!!', 'success');
    setTimeout(this._closeMessage, 5000);
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️ ' : '🚴‍♀️ '}${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id=${workout.id}>
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__operations">
          <ion-icon class="workout__edit" name="pencil-outline"></ion-icon>
          <ion-icon class="workout__delete" name="trash-outline"></ion-icon>
        </div>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️ ' : '🚴‍♀️ '
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevatioinGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(event) {
    const target = event.target;
    const workoutEl = target.closest('.workout');

    if (!target || !workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);

    // if (target.classList.contains('workout__edit')) {
    //   this._editWorkout(workout);
    // }

    if (target.classList.contains('workout__delete')) {
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');

      btnModalYes.addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          this._deleteWorkout(workout);

          modal.classList.add('hidden');
          overlay.classList.add('hidden');

          this._showMessage('Deleted Successfully', 'success');
          setTimeout(this._closeMessage, 5000);
        }.bind(this)
      );

      btnModalNo.addEventListener('click', function (event) {
        event.preventDefault();
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
      });
    }

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(workout => {
      this._renderWorkout(workout);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  _deleteWorkout(workout) {
    const deleteIndex = this.#workouts.findIndex(w => w.id === workout.id);
    this.#workouts.splice(deleteIndex, 1);
    this._setLocalStorage();
    location.reload();
  }

  _showMessage(msg, type) {
    message.querySelector('.message').textContent = msg;
    message.classList.add(type);
    message.classList.remove('message__hidden');
  }

  _closeMessage() {
    message.classList.add('message__hidden');
  }
}

const app = new App();
