'use strict';

const Person = function (birthYear) {
  this.birthYear = birthYear;
};

Person.prototype.calcAge = function () {
  // console.log(new Date().getFullYear() - this.birthYear);
  this.age = new Date().getFullYear() - this.birthYear;
};

Person.prototype.species = 'Human';

const jonas = new Person(1997);
jonas.calcAge();

console.log(jonas);
console.log(jonas.species);
console.log(Person.prototype.isPrototypeOf(jonas));
console.log(jonas.hasOwnProperty('birthYear'));

console.log(jonas.__proto__.__proto__);

// Coding Challenge 1
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} going at ${this.speed} km/h`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} going at ${this.speed} km/h`);
};

const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

bmw.accelerate();
bmw.brake();

mercedes.brake();
mercedes.brake();
mercedes.brake();
mercedes.brake();
mercedes.brake();

// Coding Challenge 1 using class
class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} going at ${this.speed} km/h`);
    return this;
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} going at ${this.speed} km/h`);
    return this;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }

  get speedUS() {
    return `${this.make} going at ${this.speed / 1.6} mi/h`;
  }
}

const mazda = new CarCl('Mazda', 150);
mazda.accelerate();
mazda.accelerate();
mazda.accelerate();
mazda.brake();
mazda.brake();
mazda.brake();
mazda.brake();
mazda.brake();
mazda.speedUS = 30000;
console.log(mazda.speed);
console.log(mazda.speedUS);

// Coding Challenge 3
const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge -= 1;
  console.log(
    `${this.make} going at ${this.speed} km/h, with a charge ${this.charge}%`
  );
};

const tesla = new EV('Tesla', 120, 23);
tesla.accelerate();

class EVCL extends CarCl {
  #charge;
  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }

  accelerate() {
    this.speed += 20;
    this.#charge -= 1;
    console.log(
      `${this.make} going at ${this.speed} km/h, with a charge ${this.#charge}%`
    );
    return this;
  }

  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    console.log(
      `${this.make} going at ${this.speed} km/h, with a charge ${this.#charge}%`
    );
    return this;
  }
}

const rivian = new EVCL('Rivian', 120, 23);

rivian.accelerate().chargeBattery(85).brake();
console.log(rivian.speedUS);
