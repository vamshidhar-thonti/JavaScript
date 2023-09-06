'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// ---- forEach on Arrays ---- //
/*
The arguments of the callback function is as follow
Argument 1: Each element of the Original (movements) Array
Argument 2: Index of that particular element | In for-of to get index we use entries()
Argument 3: Original Array over which the forEach loop is running

One backdraw of forEach is that, unlike for-of loop, it doesn't support break and continue keywords
*/

/*
movements.forEach((movement, index, originalArray) => {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: Deposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: Withdrawn ${Math.abs(movement)}`);
  }
  console.log(originalArray);
});

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
  console.log(map);
});
*/

const updateUI = function (account) {
  displayMovements(account.movements);
  calcDisplayBalance(account.movements);
  displaySummary(account);
};

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  // Sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const movementHTML = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${movement}&nbsp;$</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', movementHTML);
  });
};

let balance;
const calcDisplayBalance = function (movements) {
  balance = movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${balance} $`;
};

const displaySummary = function (account) {
  const movements = account.movements;
  // Deposits
  const deposits = movements.filter(movement => movement > 0);
  const depositsSum = deposits.reduce(
    (accumulator, deposit) => accumulator + deposit,
    0
  );
  labelSumIn.textContent = `${depositsSum}$`;

  // Withdrawals
  const withdrawals = movements.filter(movement => movement < 0);
  const withdrawalsSum = withdrawals.reduce(
    (accumulator, withdrawal) => accumulator + withdrawal,
    0
  );
  labelSumOut.textContent = `${Math.abs(withdrawalsSum)}$`;

  // Interest
  const interest = movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((accumulator, int) => accumulator + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

// Login Implementation
let currentAccount;

btnLogin.addEventListener('click', event => {
  event.preventDefault(); // Stops the page from reloading when the login button is clicked.

  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  currentAccount = accounts.find(
    account => account?.username === username && account?.pin === pin
  );

  if (currentAccount) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);

    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    alert('Invalid Credentials!!');
  }
});

// Transfers Implementation
btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const tranferAmount = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;

  // console.log(accounts);
  const transferAccount = accounts.find(
    account =>
      account?.username === transferTo &&
      account?.username !== currentAccount.username &&
      tranferAmount > 0 &&
      tranferAmount < balance
  );

  if (transferAccount) {
    currentAccount.movements.push(-tranferAmount);
    transferAccount.movements.push(tranferAmount);
    updateUI(currentAccount);
  } else {
    alert(
      'You cannot transfer to self\nAmount cannot be negative\nAmount cannot exceed current balance\nTransfer account should be valid'
    );
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.focus();
});

// Closing Account
btnClose.addEventListener('click', event => {
  event.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  const confirmAccountIndex = accounts.findIndex(
    account =>
      account.username === confirmUser &&
      account.pin === confirmPin &&
      currentAccount.username === confirmUser
  );

  if (confirmAccountIndex >= 0 && confirmAccountIndex < accounts.length) {
    accounts.splice(confirmAccountIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputLoginUsername.focus();
  } else {
    alert('Are you mad bro??');
  }
});

// Request Loan
btnLoan.addEventListener('click', event => {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(movement => movement >= 0.1 * loanAmount)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
  } else {
    alert('Atleast one deposit should be 10% of the requesting Loan amount.');
  }
});

// Sorting
let sorted = false;
btnSort.addEventListener('click', event => {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Scraping
labelBalance.addEventListener('click', event => {
  event.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('$', ''))
  );
  console.log(movementsUI);
});

// Coding Challenge 1
const checkDogs = function (dogsJulia, dogsKate) {
  let copyOfDogsJulia = dogsJulia.slice();
  copyOfDogsJulia.splice(0, 1);
  copyOfDogsJulia.splice(-2, 2);
  const allDogs = copyOfDogsJulia.concat(dogsKate);
  allDogs.forEach((dog, index) => {
    if (dog >= 3) {
      console.log(
        `"Dog number ${index + 1} is an adult, and is ${dog} years old`
      );
    } else {
      console.log(`"Dog number ${index + 1} is still a puppy 🐶`);
    }
  });
};

// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];
const julia = [9, 16, 6, 8, 3];
const kate = [10, 5, 6, 1, 4];

// checkDogs(julia, kate);

const euroToUSD = 1.1;
const movementsUSD = movements.map(mov => mov * euroToUSD);
// console.log(movements, movementsUSD);

function createUserNames(__accounts) {
  __accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(names => names[0])
      .join('');
  });
}

createUserNames(accounts);
// console.log(accounts);

const deposits = movements.filter(movement => movement > 0);
const withdrawls = movements.filter(movement => movement < 0);
// console.log(deposits, withdrawls);

const __balance = movements.reduce((accumulator, movement, index, arr) => {
  return accumulator + movement;
}, 0);
// console.log(__balance);

// Coding challenge 2 & 3
const calcAverageHumanAge = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(adultDog => adultDog >= 18)
    .reduce(
      (accumulator, adultDog, _, arr) => accumulator + adultDog / arr.length,
      0
    );
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

const allTransactions = accounts
  .map(account => account.movements)
  .flat()
  .reduce((accumulator, movement) => accumulator + movement, 0);

console.log(allTransactions);

const usingFlatMap = accounts
  .flatMap(account => account.movements)
  .reduce((accumulator, movement) => accumulator + movement, 0);

console.log(usingFlatMap);

// Exercise 1.a
const totalDeposits = accounts
  .flatMap(account => account.movements)
  .filter(movement => movement > 0)
  .reduce((accumulator, movement) => accumulator + movement, 0);
console.log(totalDeposits);

// Exercise 1.b
const totalWithdrawals = accounts
  .flatMap(account => account.movements)
  .filter(movement => movement < 0)
  .reduce((accumulator, movement) => accumulator + movement, 0);
console.log(totalWithdrawals);

// Exercise 2
const deposits1000 = accounts
  .flatMap(account => account.movements)
  .filter(movement => movement >= 1000).length;
console.log(deposits1000);

// Exercise 3
const sums = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sum, cur) => {
      cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// Exercise 4
const capitalize = title => {
  return title
    .toLowerCase()
    .split(' ')
    .map(word => word.at(0).toUpperCase() + word.slice(1))
    .join(' ');
};
console.log(capitalize('this is a nice title'));

// 100 Random dice rolls
const diceRolls100 = Array.from(
  { length: 100 },
  (_, i) => Math.trunc(Math.random() * 6) + 1
);
console.log(diceRolls100);

// Challenge 4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
let ownersEatTooMuch = [];
let ownersEatTooLittle = [];

const recommendedFoodRange = dog => {
  const currentFood = dog.curFood;
  const recommendedFood = dog.recommendedFood;
  if (currentFood < recommendedFood * 0.9) {
    ownersEatTooLittle.push(dog.owners);
    console.log('Eating too little');
  } else if (currentFood > recommendedFood * 1.1) {
    ownersEatTooMuch.push(dog.owners);
    console.log('Eating too much');
  } else {
    console.log('Eating enough');
  }
};

dogs.forEach(
  dog => (dog.recommendedFood = Math.round(dog.weight ** 0.75 * 28))
);
console.log(dogs);

// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// recommendedFoodRange(sarahDog);

dogs.forEach(dog => recommendedFoodRange(dog));
console.log(ownersEatTooMuch.flat(), ownersEatTooLittle.flat());
