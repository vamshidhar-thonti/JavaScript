'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section
const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },
};

const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

const [players1, players2] = game.players;
const [gk, ...fieldPlayers] = players1;
const allPlayers = [...players1, ...players2];
const players1Final = ['Thiago', 'Coutinho', 'Perisic', ...players1];
let { team1, x: draw, team2 } = game.odds;
console.log(team1, draw, team2);

function printGoals(...players) {
  console.log(`${players.length} goals were scored!!`);
}

printGoals('Davies', 'Muller');
printGoals(...game.scored);

team1 < team2 && console.log('Team1 is likely to win');
team1 > team2 && console.log('Team2 is likely to win');

for (const [index, score] of game.scored.entries()) {
  console.log(`Goal ${index + 1}: ${score}`);
}

let total = 0;
for (const odd of Object.values(game.odds)) {
  total += odd;
}
console.log(total / Object.values(game.odds).length);

for (const [key, odd] of Object.entries(game.odds)) {
  console.log(`Odd of victory ${game[key] ?? ''}: ${odd}`);
}

let scorers = {};

for (const player of game.scored) {
  if (Object.keys(scorers).includes(player)) {
    scorers[player] += 1;
  } else {
    scorers[player] = 1;
  }
}

console.log(scorers);

const gameEvents = new Map([
  [17, '⚽ GOAL'],
  [36, '� Substitution'],
  [47, '⚽ GOAL'],
  [61, '� Substitution'],
  [64, '� Yellow card'],
  [69, '� Red card'],
  [70, '� Substitution'],
  [72, '� Substitution'],
  [76, '⚽ GOAL'],
  [80, '⚽ GOAL'],
  [92, '� Yellow card'],
]);

const events = [...new Set(gameEvents.values())];
console.log(events);
gameEvents.delete(64);
console.log(gameEvents);
console.log(
  `"An event happened, on average, every ${90 / gameEvents.size} minutes`
);
for (const [time, event] of gameEvents) {
  if (time < 45) {
    console.log(`[FIRST HALF] ${time}: ${event}`);
  } else {
    console.log(`[SECOND HALF] ${time}: ${event}`);
  }
}

document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

const convertToCamelCase = word => {
  let splits = word.toLowerCase().trim().split('_');
  for (let i = 1; i < splits.length; i++) {
    splits[i] = splits[i].charAt(0).toUpperCase() + splits[i].slice(1);
  }
  return splits.join('');
};

document.querySelector('button').addEventListener('click', () => {
  const textAreaValue = document.querySelector('textarea').value;
  let formatted = textAreaValue.split('\n');
  for (let i = 0; i < formatted.length; i++) {
    let ticks = '✔'.repeat(i + 1);
    console.log(convertToCamelCase(formatted[i]).padEnd(19, ' ') + ticks);
  }
});
